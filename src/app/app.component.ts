import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
  NgZone,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ALGORITHMS,
  AlgorithmInfo,
  SortStep,
  StepType,
  DataDistribution,
} from './models/sort-models';
import { SortAlgorithmsService } from './services/sort-algorithms.service';
import { DataGenerationService } from './services/data-generation.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  algorithms = ALGORITHMS;
  selectedAlgorithmId = 'bubble';
  secondAlgorithmId = 'selection';
  isDualMode = false;
  arrayLength = 30;
  distribution: DataDistribution = 'random';
  customInput = '';
  steps: SortStep[] = [];
  currentStepIndex = 0;
  isPlaying = false;
  speed = 500;
  speedSliderValue = 1510;
  secondSteps: SortStep[] = [];
  secondStepIndex = 0;
  secondIsComplete = false;
  firstIsComplete = false;
  isStabilityMode = false;
  isCodePanelOpen = false;
  selectedChartAlgorithms = new Set<string>(['bubble', 'quick', 'merge', 'heap']);
  stabilityTags = new Map<number, string[]>();
  originalTagOrder = new Map<number, string[]>();
  sortedTagOrder = new Map<number, string[]>();
  isStableResult = true;
  stabilityExplanation = '';
  private animationTimer: any = null;
  private renderLoopId: any = null;
  private destroy$ = false;
  private swapAnimationFrame = 0;

  @ViewChild('barCanvas') barCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('barCanvas2') barCanvas2!: ElementRef<HTMLCanvasElement>;
  @ViewChild('heapCanvas') heapCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  private currentArray: number[] = [];

  get totalSteps(): number {
    return this.steps.length > 0 ? this.steps.length - 1 : 0;
  }

  get currentStep(): SortStep {
    if (this.steps.length === 0) {
      return {
        type: 'done' as StepType,
        indices: [],
        array: [],
        description: '',
        codeLine: 0,
        variables: {},
        comparisons: 0,
        swaps: 0,
      };
    }
    return this.steps[this.currentStepIndex];
  }

  get currentComparisons(): number {
    return this.currentStep.comparisons;
  }

  get currentSwaps(): number {
    return this.currentStep.swaps;
  }

  get currentCodeLine(): number {
    return this.currentStep.codeLine;
  }

  get currentVariables(): Record<string, any> {
    return this.currentStep.variables;
  }

  get secondComparisons(): number {
    if (this.secondSteps.length === 0) return 0;
    return this.secondSteps[this.secondStepIndex]?.comparisons ?? 0;
  }

  get secondSwaps(): number {
    if (this.secondSteps.length === 0) return 0;
    return this.secondSteps[this.secondStepIndex]?.swaps ?? 0;
  }

  get isComplete(): boolean {
    return this.currentStep.type === 'done';
  }

  get isRunning(): boolean {
    return this.steps.length > 0 && this.currentStepIndex > 0 && !this.isComplete;
  }

  get actualToTheoreticalRatio(): string {
    if (this.steps.length === 0) return '';
    const lastStep = this.steps[this.steps.length - 1];
    const n = lastStep.array.length;
    if (n <= 1) return '';
    const info = this.getAlgorithmInfo(this.selectedAlgorithmId);
    if (!info) return '';
    const actualOps = lastStep.comparisons + lastStep.swaps;
    const nlogn = n * Math.log2(n);
    if (info.avgTime === 'O(n²)') {
      const ratio = (actualOps / (n * n)).toFixed(3);
      return `实际操作/n² = ${ratio}`;
    }
    if (info.avgTime.includes('log')) {
      const ratio = (actualOps / nlogn).toFixed(3);
      return `实际操作/n·log(n) = ${ratio}`;
    }
    if (info.avgTime === 'O(n+k)' || info.avgTime === 'O(d(n+k))') {
      const ratio = (actualOps / n).toFixed(3);
      return `实际操作/n = ${ratio}`;
    }
    return '';
  }

  constructor(
    private sortService: SortAlgorithmsService,
    private dataService: DataGenerationService,
    private ngZone: NgZone,
  ) {}

  ngOnInit(): void {
    this.generateData();
  }

  ngOnDestroy(): void {
    this.pause();
    this.destroy$ = true;
    if (this.renderLoopId) {
      cancelAnimationFrame(this.renderLoopId);
    }
  }

  ngAfterViewInit(): void {
    this.renderAll();
    this.startRenderLoop();
  }

  private startRenderLoop(): void {
    const loop = () => {
      if (this.destroy$) return;
      this.renderAll();
      this.renderLoopId = requestAnimationFrame(loop);
    };
    this.renderLoopId = requestAnimationFrame(loop);
  }

  generateData(): void {
    if (this.isStabilityMode) {
      const result = this.dataService.generateForStability(this.arrayLength);
      this.currentArray = result.values;
      this.stabilityTags = result.tags;
      const tagOrder = new Map<number, string[]>();
      for (const [val, tags] of this.stabilityTags) {
        tagOrder.set(val, [...tags]);
      }
      this.originalTagOrder = tagOrder;
    } else {
      this.currentArray = this.dataService.generate(this.arrayLength, this.distribution, this.customInput);
      this.stabilityTags = new Map<number, string[]>();
      this.originalTagOrder = new Map<number, string[]>();
    }
    this.initSteps();
  }

  initSteps(): void {
    this.steps = this.sortService.generateSteps(this.selectedAlgorithmId, [...this.currentArray]);
    this.currentStepIndex = 0;
    this.firstIsComplete = false;
    this.secondIsComplete = false;
    if (this.isDualMode) {
      this.secondSteps = this.sortService.generateSteps(this.secondAlgorithmId, [...this.currentArray]);
      this.secondStepIndex = 0;
    } else {
      this.secondSteps = [];
      this.secondStepIndex = 0;
    }
    this.pause();
    if (this.isStabilityMode && this.originalTagOrder.size > 0) {
      this.sortedTagOrder = new Map(this.originalTagOrder);
    }
    this.renderAll();
  }

  getAlgorithmInfo(id: string): AlgorithmInfo | undefined {
    return ALGORITHMS.find((a: AlgorithmInfo) => a.id === id);
  }

  onAlgorithmChange(): void {
    this.initSteps();
  }

  onDataChange(): void {
    this.generateData();
  }

  onSecondAlgorithmChange(): void {
    if (this.isDualMode) {
      this.secondSteps = this.sortService.generateSteps(this.secondAlgorithmId, [...this.currentArray]);
      this.secondStepIndex = 0;
      this.secondIsComplete = false;
      this.renderAll();
    }
  }

  setDualMode(dual: boolean): void {
    this.isDualMode = dual;
    this.initSteps();
  }

  togglePlay(): void {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play(): void {
    if (this.isPlaying) return;
    if (this.isComplete && !this.isDualMode) return;
    if (this.isDualMode && this.firstIsComplete && this.secondIsComplete) return;
    this.isPlaying = true;
    this.animationTimer = setInterval(() => {
      if (this.destroy$) return;
      this.stepForward();
    }, this.speed);
  }

  pause(): void {
    this.isPlaying = false;
    if (this.animationTimer) {
      clearInterval(this.animationTimer);
      this.animationTimer = null;
    }
  }

  stepForward(): void {
    if (this.currentStepIndex < this.totalSteps) {
      this.currentStepIndex++;
    }
    if (!this.firstIsComplete && this.currentStep.type === 'done') {
      this.firstIsComplete = true;
      if (this.isStabilityMode) {
        this.checkStability();
      }
    }
    if (this.isDualMode && this.secondStepIndex < this.secondSteps.length - 1) {
      this.secondStepIndex++;
    }
    if (this.isDualMode && !this.secondIsComplete && this.secondSteps.length > 0 && this.secondSteps[this.secondStepIndex].type === 'done') {
      this.secondIsComplete = true;
    }
    this.renderAll();
    if (this.isDualMode && this.firstIsComplete && this.secondIsComplete) {
      this.pause();
    }
    if (!this.isDualMode && this.firstIsComplete) {
      this.pause();
    }
  }

  stepBack(): void {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.firstIsComplete = false;
    }
    if (this.isDualMode && this.secondStepIndex > 0) {
      this.secondStepIndex--;
      this.secondIsComplete = false;
    }
    this.renderAll();
  }

  onProgressChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.currentStepIndex = parseInt(input.value, 10) || 0;
    if (this.isDualMode && this.secondSteps.length > 0 && this.totalSteps > 0) {
      const ratio = this.currentStepIndex / this.totalSteps;
      this.secondStepIndex = Math.min(Math.round(ratio * (this.secondSteps.length - 1)), this.secondSteps.length - 1);
    }
    this.firstIsComplete = this.steps.length > 0 && this.steps[this.currentStepIndex].type === 'done';
    if (this.isDualMode) {
      this.secondIsComplete = this.secondSteps.length > 0 && this.secondSteps[this.secondStepIndex].type === 'done';
    }
    this.renderAll();
  }

  reset(): void {
    this.pause();
    this.currentStepIndex = 0;
    this.secondStepIndex = 0;
    this.firstIsComplete = false;
    this.secondIsComplete = false;
    this.renderAll();
  }

  getVizState(steps: SortStep[], stepIndex: number): {
    array: number[];
    comparing: number[];
    swapping: number[];
    sorted: Set<number>;
    pivot: number;
    rangeStart: number;
    rangeEnd: number;
  } {
    const empty = {
      array: [],
      comparing: [],
      swapping: [],
      sorted: new Set<number>(),
      pivot: -1,
      rangeStart: -1,
      rangeEnd: -1,
    };
    if (steps.length === 0 || stepIndex < 0 || stepIndex >= steps.length) {
      return empty;
    }
    const sorted = new Set<number>();
    for (let i = 0; i <= stepIndex; i++) {
      if (steps[i].type === 'sorted') {
        for (const idx of steps[i].indices) {
          sorted.add(idx);
        }
      }
    }
    const step = steps[stepIndex];
    let comparing: number[] = [];
    let swapping: number[] = [];
    let pivot = -1;
    let rangeStart = -1;
    let rangeEnd = -1;
    switch (step.type) {
      case 'compare':
        comparing = step.indices;
        break;
      case 'swap':
        swapping = step.indices;
        break;
      case 'overwrite':
        swapping = step.indices;
        break;
      case 'pivot':
        pivot = step.indices[0] ?? -1;
        break;
      case 'range_start':
        rangeStart = step.rangeStart ?? -1;
        rangeEnd = step.rangeEnd ?? -1;
        break;
      case 'range_end':
        rangeStart = step.rangeStart ?? -1;
        rangeEnd = step.rangeEnd ?? -1;
        break;
    }
    return {
      array: step.array,
      comparing,
      swapping,
      sorted,
      pivot,
      rangeStart,
      rangeEnd,
    };
  }

  renderAll(): void {
    if (this.destroy$) return;
    this.swapAnimationFrame++;
    if (this.barCanvas?.nativeElement) {
      this.renderBarChart(this.barCanvas, this.steps, this.currentStepIndex, this.isStabilityMode ? this.stabilityTags : undefined);
    }
    if (this.isDualMode && this.barCanvas2?.nativeElement) {
      this.renderBarChart(this.barCanvas2, this.secondSteps, this.secondStepIndex);
    }
    if (this.selectedAlgorithmId === 'heap' && this.heapCanvas?.nativeElement) {
      this.renderHeapTree(this.heapCanvas, this.steps, this.currentStepIndex);
    }
    if (this.chartCanvas?.nativeElement) {
      this.renderComplexityChart(this.chartCanvas);
    }
  }

  renderBarChart(canvas: ElementRef, steps: SortStep[], stepIndex: number, stabilityTags?: Map<number, string[]>): void {
    const el = canvas.nativeElement as HTMLCanvasElement;
    const ctx = el.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, el.width, el.height);
    const vizState = this.getVizState(steps, stepIndex);
    if (vizState.array.length === 0) return;
    const parentEl = el.parentElement;
    const canvasWidth = parentEl ? parentEl.clientWidth : el.width;
    const canvasHeight = this.isDualMode ? 200 : 300;
    el.width = canvasWidth;
    el.height = canvasHeight;
    const array = vizState.array;
    const arrayLength = array.length;
    const maxVal = Math.max(...array, 1);
    const barWidth = canvasWidth / arrayLength;
    const gap = 1;
    for (let i = 0; i < arrayLength; i++) {
      const barHeight = (array[i] / maxVal) * (canvasHeight - 30);
      const x = i * barWidth;
      const y = canvasHeight - barHeight;
      if (vizState.swapping.includes(i)) {
        const flashIntensity = (Math.sin(this.swapAnimationFrame * 0.3) + 1) / 2;
        const r = Math.floor(244 + (255 - 244) * flashIntensity);
        const g = Math.floor(67 + (200 - 67) * flashIntensity);
        const b = Math.floor(54 + (100 - 54) * flashIntensity);
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.shadowColor = '#F44336';
        ctx.shadowBlur = 10 + 10 * flashIntensity;
      } else if (vizState.comparing.includes(i)) {
        ctx.fillStyle = '#FF9800';
        ctx.shadowBlur = 0;
      } else if (vizState.sorted.has(i)) {
        ctx.fillStyle = '#4CAF50';
        ctx.shadowBlur = 0;
      } else if (vizState.pivot === i) {
        ctx.fillStyle = '#9C27B0';
        ctx.shadowBlur = 0;
      } else {
        ctx.fillStyle = '#5B8DEF';
        ctx.shadowBlur = 0;
      }
      ctx.fillRect(x + gap / 2, y, barWidth - gap, barHeight);
      ctx.shadowBlur = 0;
      if (stabilityTags && stabilityTags.size > 0) {
        const valueCounts = new Map<number, number>();
        for (const v of array) {
          valueCounts.set(v, (valueCounts.get(v) ?? 0) + 1);
        }
        const val = array[i];
        if ((valueCounts.get(val) ?? 0) > 1) {
          const tags = stabilityTags.get(val);
          if (tags) {
            const occurrenceIndex = array.slice(0, i).filter(v => v === val).length;
            if (occurrenceIndex < tags.length) {
              const dotColor = tags[occurrenceIndex];
              ctx.fillStyle = dotColor;
              ctx.beginPath();
              const dotRadius = Math.min(4, barWidth / 3);
              ctx.arc(x + barWidth / 2, y + 6, dotRadius, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }
      if (arrayLength <= 30) {
        ctx.fillStyle = '#333';
        ctx.font = `${Math.min(10, barWidth - 2)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(String(array[i]), x + barWidth / 2, y - 4);
      }
    }
    if (vizState.rangeStart >= 0 && vizState.rangeEnd >= 0 && vizState.rangeStart < arrayLength && vizState.rangeEnd < arrayLength) {
      ctx.fillStyle = 'rgba(255, 235, 59, 0.15)';
      const rx = vizState.rangeStart * barWidth;
      const rw = (vizState.rangeEnd - vizState.rangeStart + 1) * barWidth;
      ctx.fillRect(rx, 0, rw, canvasHeight);
    }
  }

  renderHeapTree(canvas: ElementRef, steps: SortStep[], stepIndex: number): void {
    const el = canvas.nativeElement as HTMLCanvasElement;
    const ctx = el.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, el.width, el.height);
    const vizState = this.getVizState(steps, stepIndex);
    if (vizState.array.length === 0) return;
    const canvasWidth = el.width;
    const canvasHeight = 200;
    el.height = canvasHeight;
    const array = vizState.array;
    const n = array.length;
    const levels = Math.floor(Math.log2(n)) + 1;
    const verticalGap = 40;
    const nodeRadius = 18;
    const positions: { x: number; y: number }[] = [];
    for (let i = 0; i < n; i++) {
      const level = Math.floor(Math.log2(i + 1));
      const posInLevel = i - (Math.pow(2, level) - 1);
      const nodesInLevel = Math.pow(2, level);
      const levelWidth = canvasWidth * 0.9;
      const startX = (canvasWidth - levelWidth) / 2;
      const xSpacing = levelWidth / nodesInLevel;
      const x = startX + xSpacing * posInLevel + xSpacing / 2;
      const y = level * verticalGap + 30;
      positions.push({ x, y });
    }
    ctx.strokeStyle = '#999';
    ctx.lineWidth = 1;
    for (let i = 0; i < n; i++) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      if (left < n) {
        ctx.beginPath();
        ctx.moveTo(positions[i].x, positions[i].y);
        ctx.lineTo(positions[left].x, positions[left].y);
        ctx.stroke();
      }
      if (right < n) {
        ctx.beginPath();
        ctx.moveTo(positions[i].x, positions[i].y);
        ctx.lineTo(positions[right].x, positions[right].y);
        ctx.stroke();
      }
    }
    for (let i = 0; i < n; i++) {
      let fillColor = '#5B8DEF';
      ctx.shadowBlur = 0;
      if (vizState.swapping.includes(i)) {
        const flashIntensity = (Math.sin(this.swapAnimationFrame * 0.3) + 1) / 2;
        const r = Math.floor(244 + (255 - 244) * flashIntensity);
        const g = Math.floor(67 + (200 - 67) * flashIntensity);
        const b = Math.floor(54 + (100 - 54) * flashIntensity);
        fillColor = `rgb(${r}, ${g}, ${b})`;
        ctx.shadowColor = '#F44336';
        ctx.shadowBlur = 10 + 10 * flashIntensity;
      } else if (vizState.comparing.includes(i)) {
        fillColor = '#FF9800';
      } else if (vizState.sorted.has(i)) {
        fillColor = '#4CAF50';
      } else if (vizState.pivot === i) {
        fillColor = '#9C27B0';
      }
      ctx.fillStyle = fillColor;
      ctx.beginPath();
      ctx.arc(positions[i].x, positions[i].y, nodeRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#FFF';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(array[i]), positions[i].x, positions[i].y);
    }
  }

  renderComplexityChart(canvas: ElementRef): void {
    const el = canvas.nativeElement as HTMLCanvasElement;
    const ctx = el.getContext('2d');
    if (!ctx) return;
    const canvasWidth = 600;
    const canvasHeight = 300;
    el.width = canvasWidth;
    el.height = canvasHeight;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    const padding = { top: 30, right: 30, bottom: 50, left: 60 };
    const chartWidth = canvasWidth - padding.left - padding.right;
    const chartHeight = canvasHeight - padding.top - padding.bottom;
    const xValues = [10, 20, 50, 100, 200];
    const colors = [
      '#F44336', '#E91E63', '#9C27B0', '#3F51B5', '#03A9F4',
      '#009688', '#4CAF50', '#FF9800', '#795548', '#607D8B',
    ];
    const algorithmIds = Array.from(this.selectedChartAlgorithms);
    const data: Map<string, number[]> = new Map();
    let maxY = 0;
    for (const algId of algorithmIds) {
      const ops: number[] = [];
      for (const len of xValues) {
        const arr = this.dataService.generate(len, 'random');
        const sortSteps = this.sortService.generateSteps(algId, arr);
        if (sortSteps.length > 0) {
          const lastStep = sortSteps[sortSteps.length - 1];
          ops.push(lastStep.comparisons + lastStep.swaps);
        } else {
          ops.push(0);
        }
      }
      data.set(algId, ops);
      const maxOps = Math.max(...ops);
      if (maxOps > maxY) maxY = maxOps;
    }
    if (maxY === 0) maxY = 100;
    maxY = Math.ceil(maxY * 1.1);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, canvasHeight - padding.bottom);
    ctx.lineTo(canvasWidth - padding.right, canvasHeight - padding.bottom);
    ctx.stroke();
    const yTicks = 5;
    ctx.fillStyle = '#333';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'right';
    for (let i = 0; i <= yTicks; i++) {
      const val = Math.round((maxY / yTicks) * i);
      const y = canvasHeight - padding.bottom - (i / yTicks) * chartHeight;
      ctx.fillText(String(val), padding.left - 8, y + 3);
      ctx.strokeStyle = '#E0E0E0';
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(canvasWidth - padding.right, y);
      ctx.stroke();
    }
    ctx.textAlign = 'center';
    ctx.strokeStyle = '#333';
    for (let i = 0; i < xValues.length; i++) {
      const x = padding.left + (i / (xValues.length - 1)) * chartWidth;
      ctx.fillText(String(xValues[i]), x, canvasHeight - padding.bottom + 18);
    }
    ctx.fillStyle = '#333';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('n (数组长度)', padding.left + chartWidth / 2, canvasHeight - 5);
    ctx.save();
    ctx.translate(12, padding.top + chartHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('操作次数', 0, 0);
    ctx.restore();
    let colorIdx = 0;
    for (const algId of algorithmIds) {
      const ops = data.get(algId);
      if (!ops) continue;
      const info = this.getAlgorithmInfo(algId);
      const color = colors[colorIdx % colors.length];
      colorIdx++;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < ops.length; i++) {
        const x = padding.left + (i / (xValues.length - 1)) * chartWidth;
        const y = canvasHeight - padding.bottom - (ops[i] / maxY) * chartHeight;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    }
    const legendX = canvasWidth - padding.right - 150;
    let legendY = padding.top + 10;
    colorIdx = 0;
    for (const algId of algorithmIds) {
      const info = this.getAlgorithmInfo(algId);
      const color = colors[colorIdx % colors.length];
      colorIdx++;
      ctx.fillStyle = color;
      ctx.fillRect(legendX, legendY, 12, 12);
      ctx.fillStyle = '#333';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(info?.nameCn ?? algId, legendX + 16, legendY + 10);
      legendY += 18;
    }
  }

  toggleChartAlgorithm(id: string): void {
    if (this.selectedChartAlgorithms.has(id)) {
      if (this.selectedChartAlgorithms.size > 1) {
        this.selectedChartAlgorithms.delete(id);
      }
    } else {
      this.selectedChartAlgorithms.add(id);
    }
    this.renderAll();
  }

  onStabilityModeChange(): void {
    if (this.isStabilityMode) {
      const result = this.dataService.generateForStability(this.arrayLength);
      this.currentArray = result.values;
      this.stabilityTags = result.tags;
      const tagOrder = new Map<number, string[]>();
      for (const [val, tags] of this.stabilityTags) {
        tagOrder.set(val, [...tags]);
      }
      this.originalTagOrder = tagOrder;
    } else {
      this.currentArray = this.dataService.generate(this.arrayLength, this.distribution, this.customInput);
      this.stabilityTags = new Map<number, string[]>();
      this.originalTagOrder = new Map<number, string[]>();
      this.sortedTagOrder = new Map<number, string[]>();
      this.isStableResult = true;
      this.stabilityExplanation = '';
    }
    this.initSteps();
  }

  checkStability(): void {
    if (this.steps.length === 0) return;
    const sortedArray = this.steps[this.steps.length - 1].array;
    const newTagOrder = new Map<number, string[]>();
    const valueOccurrence = new Map<number, number>();
    for (const val of sortedArray) {
      const idx = valueOccurrence.get(val) ?? 0;
      valueOccurrence.set(val, idx + 1);
      const tags = this.originalTagOrder.get(val);
      if (tags && idx < tags.length) {
        if (!newTagOrder.has(val)) {
          newTagOrder.set(val, []);
        }
        newTagOrder.get(val)!.push(tags[idx]);
      }
    }
    this.sortedTagOrder = newTagOrder;
    let isStable = true;
    const explanations: string[] = [];
    for (const [val, originalTags] of this.originalTagOrder) {
      const sortedTags = this.sortedTagOrder.get(val);
      if (!sortedTags || originalTags.length !== sortedTags.length) continue;
      if (originalTags.length <= 1) continue;
      const same = originalTags.every((tag, i) => tag === sortedTags[i]);
      if (!same) {
        isStable = false;
        explanations.push(`值 ${val} 的标签顺序改变：原始 [${originalTags.join(', ')}] → 排序后 [${sortedTags.join(', ')}]`);
      }
    }
    this.isStableResult = isStable;
    if (isStable) {
      this.stabilityExplanation = '排序稳定：所有重复元素的相对顺序保持不变';
    } else {
      this.stabilityExplanation = '排序不稳定：' + explanations.join('；');
    }
  }

  getSecondVizState(): {
    array: number[];
    comparing: number[];
    swapping: number[];
    sorted: Set<number>;
    pivot: number;
    rangeStart: number;
    rangeEnd: number;
  } {
    return this.getVizState(this.secondSteps, this.secondStepIndex);
  }

  onSpeedChange(): void {
    this.speed = 2010 - this.speedSliderValue;
    if (this.isPlaying) {
      clearInterval(this.animationTimer);
      this.animationTimer = setInterval(() => {
        if (this.destroy$) return;
        this.stepForward();
      }, this.speed);
    }
  }

  getChartColor(index: number): string {
    const colors = [
      '#F44336', '#E91E63', '#9C27B0', '#3F51B5', '#03A9F4',
      '#009688', '#4CAF50', '#FF9800', '#795548', '#607D8B',
    ];
    return colors[index % colors.length];
  }
}
