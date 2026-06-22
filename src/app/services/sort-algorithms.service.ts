import { Injectable } from '@angular/core';
import { SortStep, StepType } from '../models/sort-models';

@Injectable({ providedIn: 'root' })
export class SortAlgorithmsService {

  generateSteps(algorithmId: string, inputArray: number[]): SortStep[] {
    const arr = [...inputArray];
    switch (algorithmId) {
      case 'bubble': return this.bubbleSort(arr);
      case 'selection': return this.selectionSort(arr);
      case 'insertion': return this.insertionSort(arr);
      case 'shell': return this.shellSort(arr);
      case 'merge': return this.mergeSort(arr);
      case 'quick': return this.quickSort(arr);
      case 'heap': return this.heapSort(arr);
      case 'counting': return this.countingSort(arr);
      case 'radix': return this.radixSort(arr);
      case 'bucket': return this.bucketSort(arr);
      default: return [];
    }
  }

  private bubbleSort(arr: number[]): SortStep[] {
    const steps: SortStep[] = [];
    let comparisons = 0;
    let swaps = 0;
    const n = arr.length;

    steps.push({
      type: 'range_start' as StepType,
      indices: Array.from({ length: n }, (_, i) => i),
      array: [...arr],
      description: `初始数组，范围 [0, ${n - 1}]`,
      codeLine: 0,
      variables: { n },
      comparisons,
      swaps,
      rangeStart: 0,
      rangeEnd: n - 1,
    });

    for (let i = 0; i < n - 1; i++) {
      steps.push({
        type: 'range_start' as StepType,
        indices: Array.from({ length: n }, (_, k) => k),
        array: [...arr],
        description: `第 ${i + 1} 轮冒泡`,
        codeLine: 2,
        variables: { n, i },
        comparisons,
        swaps,
        rangeStart: 0,
        rangeEnd: n - 1 - i,
      });

      for (let j = 0; j < n - 1 - i; j++) {
        comparisons++;
        steps.push({
          type: 'compare' as StepType,
          indices: [j, j + 1],
          values: [arr[j], arr[j + 1]],
          array: [...arr],
          description: `比较 arr[${j}]=${arr[j]} 和 arr[${j + 1}]=${arr[j + 1]}`,
          codeLine: 4,
          variables: { n, i, j },
          comparisons,
          swaps,
          rangeStart: 0,
          rangeEnd: n - 1 - i,
        });

        if (arr[j] > arr[j + 1]) {
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          swaps++;
          steps.push({
            type: 'swap' as StepType,
            indices: [j, j + 1],
            values: [arr[j], arr[j + 1]],
            array: [...arr],
            description: `交换 arr[${j}] 和 arr[${j + 1}]`,
            codeLine: 5,
            variables: { n, i, j },
            comparisons,
            swaps,
            rangeStart: 0,
            rangeEnd: n - 1 - i,
          });
        }
      }

      steps.push({
        type: 'sorted' as StepType,
        indices: [n - 1 - i],
        array: [...arr],
        description: `arr[${n - 1 - i}]=${arr[n - 1 - i]} 已就位`,
        codeLine: 5,
        variables: { n, i },
        comparisons,
        swaps,
      });
    }

    steps.push({
      type: 'sorted' as StepType,
      indices: [0],
      array: [...arr],
      description: `arr[0]=${arr[0]} 已就位`,
      codeLine: 5,
      variables: { n },
      comparisons,
      swaps,
    });

    steps.push({
      type: 'done' as StepType,
      indices: Array.from({ length: n }, (_, i) => i),
      array: [...arr],
      description: '排序完成',
      codeLine: 6,
      variables: {},
      comparisons,
      swaps,
    });

    return steps;
  }

  private selectionSort(arr: number[]): SortStep[] {
    const steps: SortStep[] = [];
    let comparisons = 0;
    let swaps = 0;
    const n = arr.length;

    steps.push({
      type: 'range_start' as StepType,
      indices: Array.from({ length: n }, (_, i) => i),
      array: [...arr],
      description: `初始数组，范围 [0, ${n - 1}]`,
      codeLine: 0,
      variables: { n },
      comparisons,
      swaps,
      rangeStart: 0,
      rangeEnd: n - 1,
    });

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;

      steps.push({
        type: 'range_start' as StepType,
        indices: Array.from({ length: n }, (_, k) => k),
        array: [...arr],
        description: `第 ${i + 1} 轮选择，从位置 ${i} 开始查找最小值`,
        codeLine: 2,
        variables: { n, i, minIdx },
        comparisons,
        swaps,
        rangeStart: i,
        rangeEnd: n - 1,
      });

      for (let j = i + 1; j < n; j++) {
        comparisons++;
        steps.push({
          type: 'compare' as StepType,
          indices: [j, minIdx],
          values: [arr[j], arr[minIdx]],
          array: [...arr],
          description: `比较 arr[${j}]=${arr[j]} 和 arr[${minIdx}]=${arr[minIdx]}`,
          codeLine: 5,
          variables: { n, i, j, minIdx },
          comparisons,
          swaps,
          rangeStart: i,
          rangeEnd: n - 1,
        });

        if (arr[j] < arr[minIdx]) {
          minIdx = j;
          steps.push({
            type: 'set' as StepType,
            indices: [minIdx],
            values: [arr[minIdx]],
            array: [...arr],
            description: `更新最小值索引为 ${minIdx}，值为 ${arr[minIdx]}`,
            codeLine: 6,
            variables: { n, i, j, minIdx },
            comparisons,
            swaps,
            rangeStart: i,
            rangeEnd: n - 1,
          });
        }
      }

      if (minIdx !== i) {
        const temp = arr[i];
        arr[i] = arr[minIdx];
        arr[minIdx] = temp;
        swaps++;
        steps.push({
          type: 'swap' as StepType,
          indices: [i, minIdx],
          values: [arr[i], arr[minIdx]],
          array: [...arr],
          description: `交换 arr[${i}] 和 arr[${minIdx}]`,
          codeLine: 7,
          variables: { n, i, minIdx },
          comparisons,
          swaps,
        });
      }

      steps.push({
        type: 'sorted' as StepType,
        indices: [i],
        array: [...arr],
        description: `arr[${i}]=${arr[i]} 已就位`,
        codeLine: 7,
        variables: { n, i },
        comparisons,
        swaps,
      });
    }

    steps.push({
      type: 'sorted' as StepType,
      indices: [n - 1],
      array: [...arr],
      description: `arr[${n - 1}]=${arr[n - 1]} 已就位`,
      codeLine: 7,
      variables: { n },
      comparisons,
      swaps,
    });

    steps.push({
      type: 'done' as StepType,
      indices: Array.from({ length: n }, (_, i) => i),
      array: [...arr],
      description: '排序完成',
      codeLine: 8,
      variables: {},
      comparisons,
      swaps,
    });

    return steps;
  }

  private insertionSort(arr: number[]): SortStep[] {
    const steps: SortStep[] = [];
    let comparisons = 0;
    let swaps = 0;
    const n = arr.length;

    steps.push({
      type: 'range_start' as StepType,
      indices: Array.from({ length: n }, (_, i) => i),
      array: [...arr],
      description: `初始数组，范围 [0, ${n - 1}]`,
      codeLine: 0,
      variables: { n },
      comparisons,
      swaps,
      rangeStart: 0,
      rangeEnd: n - 1,
    });

    for (let i = 1; i < n; i++) {
      const key = arr[i];
      let j = i - 1;

      steps.push({
        type: 'set' as StepType,
        indices: [i],
        values: [key],
        array: [...arr],
        description: `取出 arr[${i}]=${key} 作为待插入元素`,
        codeLine: 2,
        variables: { n, i, key, j },
        comparisons,
        swaps,
        rangeStart: 0,
        rangeEnd: i,
      });

      while (j >= 0) {
        comparisons++;
        steps.push({
          type: 'compare' as StepType,
          indices: [j, j + 1],
          values: [arr[j], key],
          array: [...arr],
          description: `比较 arr[${j}]=${arr[j]} 和 key=${key}`,
          codeLine: 5,
          variables: { n, i, key, j },
          comparisons,
          swaps,
          rangeStart: 0,
          rangeEnd: i,
        });

        if (arr[j] > key) {
          arr[j + 1] = arr[j];
          swaps++;
          steps.push({
            type: 'set' as StepType,
            indices: [j, j + 1],
            values: [arr[j], arr[j + 1]],
            array: [...arr],
            description: `将 arr[${j}]=${arr[j]} 右移到 arr[${j + 1}]`,
            codeLine: 6,
            variables: { n, i, key, j },
            comparisons,
            swaps,
            rangeStart: 0,
            rangeEnd: i,
          });
          j--;
        } else {
          break;
        }
      }

      arr[j + 1] = key;
      steps.push({
        type: 'set' as StepType,
        indices: [j + 1],
        values: [key],
        array: [...arr],
        description: `将 key=${key} 插入到位置 ${j + 1}`,
        codeLine: 8,
        variables: { n, i, key, j: j + 1 },
        comparisons,
        swaps,
        rangeStart: 0,
        rangeEnd: i,
      });
    }

    steps.push({
      type: 'done' as StepType,
      indices: Array.from({ length: n }, (_, i) => i),
      array: [...arr],
      description: '排序完成',
      codeLine: 9,
      variables: {},
      comparisons,
      swaps,
    });

    return steps;
  }

  private shellSort(arr: number[]): SortStep[] {
    const steps: SortStep[] = [];
    let comparisons = 0;
    let swaps = 0;
    const n = arr.length;

    steps.push({
      type: 'range_start' as StepType,
      indices: Array.from({ length: n }, (_, i) => i),
      array: [...arr],
      description: `初始数组，范围 [0, ${n - 1}]`,
      codeLine: 0,
      variables: { n },
      comparisons,
      swaps,
      rangeStart: 0,
      rangeEnd: n - 1,
    });

    let gap = Math.floor(n / 2);

    while (gap > 0) {
      steps.push({
        type: 'range_start' as StepType,
        indices: Array.from({ length: n }, (_, k) => k),
        array: [...arr],
        description: `当前间隔 gap=${gap}`,
        codeLine: 2,
        variables: { n, gap },
        comparisons,
        swaps,
        rangeStart: 0,
        rangeEnd: n - 1,
      });

      for (let i = gap; i < n; i++) {
        const temp = arr[i];
        let j = i;

        steps.push({
          type: 'set' as StepType,
          indices: [i],
          values: [temp],
          array: [...arr],
          description: `取出 arr[${i}]=${temp}，间隔为 ${gap}`,
          codeLine: 4,
          variables: { n, gap, i, j, temp },
          comparisons,
          swaps,
          rangeStart: 0,
          rangeEnd: n - 1,
        });

        while (j >= gap) {
          comparisons++;
          steps.push({
            type: 'compare' as StepType,
            indices: [j - gap, j],
            values: [arr[j - gap], temp],
            array: [...arr],
            description: `比较 arr[${j - gap}]=${arr[j - gap]} 和 temp=${temp}`,
            codeLine: 7,
            variables: { n, gap, i, j, temp },
            comparisons,
            swaps,
            rangeStart: 0,
            rangeEnd: n - 1,
          });

          if (arr[j - gap] > temp) {
            arr[j] = arr[j - gap];
            swaps++;
            steps.push({
              type: 'set' as StepType,
              indices: [j - gap, j],
              values: [arr[j - gap], arr[j]],
              array: [...arr],
              description: `将 arr[${j - gap}]=${arr[j - gap]} 移动到 arr[${j}]`,
              codeLine: 8,
              variables: { n, gap, i, j, temp },
              comparisons,
              swaps,
              rangeStart: 0,
              rangeEnd: n - 1,
            });
            j -= gap;
          } else {
            break;
          }
        }

        if (j !== i) {
          arr[j] = temp;
          steps.push({
            type: 'set' as StepType,
            indices: [j],
            values: [temp],
            array: [...arr],
            description: `将 temp=${temp} 放到位置 ${j}`,
            codeLine: 10,
            variables: { n, gap, i, j, temp },
            comparisons,
            swaps,
            rangeStart: 0,
            rangeEnd: n - 1,
          });
        }
      }

      gap = Math.floor(gap / 2);
    }

    steps.push({
      type: 'done' as StepType,
      indices: Array.from({ length: n }, (_, i) => i),
      array: [...arr],
      description: '排序完成',
      codeLine: 12,
      variables: {},
      comparisons,
      swaps,
    });

    return steps;
  }

  private mergeSort(arr: number[]): SortStep[] {
    const steps: SortStep[] = [];
    let comparisons = 0;
    let swaps = 0;
    const n = arr.length;

    steps.push({
      type: 'range_start' as StepType,
      indices: Array.from({ length: n }, (_, i) => i),
      array: [...arr],
      description: `初始数组，范围 [0, ${n - 1}]`,
      codeLine: 0,
      variables: { n },
      comparisons,
      swaps,
      rangeStart: 0,
      rangeEnd: n - 1,
    });

    this.mergeSortHelper(arr, 0, n - 1, steps, comparisons, swaps);
    comparisons = steps[steps.length - 1].comparisons;
    swaps = steps[steps.length - 1].swaps;

    steps.push({
      type: 'done' as StepType,
      indices: Array.from({ length: n }, (_, i) => i),
      array: [...arr],
      description: '排序完成',
      codeLine: 14,
      variables: {},
      comparisons,
      swaps,
    });

    return steps;
  }

  private mergeSortHelper(
    arr: number[],
    left: number,
    right: number,
    steps: SortStep[],
    comp: number,
    sw: number,
  ): void {
    let comparisons = comp;
    let swaps = sw;

    if (left >= right) return;

    const mid = Math.floor((left + right) / 2);

    steps.push({
      type: 'range_start' as StepType,
      indices: Array.from({ length: right - left + 1 }, (_, k) => left + k),
      array: [...arr],
      description: `分割范围 [${left}, ${right}]，中点=${mid}`,
      codeLine: 1,
      variables: { left, right, mid },
      comparisons,
      swaps,
      rangeStart: left,
      rangeEnd: right,
    });

    this.mergeSortHelper(arr, left, mid, steps, comparisons, swaps);
    comparisons = steps[steps.length - 1].comparisons;
    swaps = steps[steps.length - 1].swaps;

    this.mergeSortHelper(arr, mid + 1, right, steps, comparisons, swaps);
    comparisons = steps[steps.length - 1].comparisons;
    swaps = steps[steps.length - 1].swaps;

    this.merge(arr, left, mid, right, steps, comparisons, swaps);
    comparisons = steps[steps.length - 1].comparisons;
    swaps = steps[steps.length - 1].swaps;

    steps.push({
      type: 'range_end' as StepType,
      indices: Array.from({ length: right - left + 1 }, (_, k) => left + k),
      array: [...arr],
      description: `合并完成，范围 [${left}, ${right}]`,
      codeLine: 5,
      variables: { left, right, mid },
      comparisons,
      swaps,
      rangeStart: left,
      rangeEnd: right,
    });
  }

  private merge(
    arr: number[],
    l: number,
    m: number,
    r: number,
    steps: SortStep[],
    comp: number,
    sw: number,
  ): void {
    let comparisons = comp;
    let swaps = sw;
    const leftArr = arr.slice(l, m + 1);
    const rightArr = arr.slice(m + 1, r + 1);
    let i = 0;
    let j = 0;
    let k = l;

    steps.push({
      type: 'range_start' as StepType,
      indices: Array.from({ length: r - l + 1 }, (_, idx) => l + idx),
      array: [...arr],
      description: `合并 [${l}..${m}] 和 [${m + 1}..${r}]`,
      codeLine: 7,
      variables: { l, m, r, i: 0, j: 0, k: l },
      comparisons,
      swaps,
      rangeStart: l,
      rangeEnd: r,
    });

    while (i < leftArr.length && j < rightArr.length) {
      comparisons++;
      steps.push({
        type: 'compare' as StepType,
        indices: [l + i, m + 1 + j],
        values: [leftArr[i], rightArr[j]],
        array: [...arr],
        description: `比较 L[${i}]=${leftArr[i]} 和 R[${j}]=${rightArr[j]}`,
        codeLine: 10,
        variables: { l, m, r, i, j, k },
        comparisons,
        swaps,
        rangeStart: l,
        rangeEnd: r,
      });

      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i];
        steps.push({
          type: 'overwrite' as StepType,
          indices: [k],
          values: [leftArr[i]],
          array: [...arr],
          description: `将 L[${i}]=${leftArr[i]} 放入位置 ${k}`,
          codeLine: 11,
          variables: { l, m, r, i, j, k },
          comparisons,
          swaps,
          rangeStart: l,
          rangeEnd: r,
        });
        i++;
      } else {
        arr[k] = rightArr[j];
        swaps++;
        steps.push({
          type: 'overwrite' as StepType,
          indices: [k],
          values: [rightArr[j]],
          array: [...arr],
          description: `将 R[${j}]=${rightArr[j]} 放入位置 ${k}`,
          codeLine: 12,
          variables: { l, m, r, i, j, k },
          comparisons,
          swaps,
          rangeStart: l,
          rangeEnd: r,
        });
        j++;
      }
      k++;
    }

    while (i < leftArr.length) {
      arr[k] = leftArr[i];
      steps.push({
        type: 'overwrite' as StepType,
        indices: [k],
        values: [leftArr[i]],
        array: [...arr],
        description: `复制剩余 L[${i}]=${leftArr[i]} 到位置 ${k}`,
        codeLine: 13,
        variables: { l, m, r, i, j, k },
        comparisons,
        swaps,
        rangeStart: l,
        rangeEnd: r,
      });
      i++;
      k++;
    }

    while (j < rightArr.length) {
      arr[k] = rightArr[j];
      steps.push({
        type: 'overwrite' as StepType,
        indices: [k],
        values: [rightArr[j]],
        array: [...arr],
        description: `复制剩余 R[${j}]=${rightArr[j]} 到位置 ${k}`,
        codeLine: 13,
        variables: { l, m, r, i, j, k },
        comparisons,
        swaps,
        rangeStart: l,
        rangeEnd: r,
      });
      j++;
      k++;
    }
  }

  private quickSort(arr: number[]): SortStep[] {
    const steps: SortStep[] = [];
    let comparisons = 0;
    let swaps = 0;
    const n = arr.length;

    steps.push({
      type: 'range_start' as StepType,
      indices: Array.from({ length: n }, (_, i) => i),
      array: [...arr],
      description: `初始数组，范围 [0, ${n - 1}]`,
      codeLine: 0,
      variables: { n },
      comparisons,
      swaps,
      rangeStart: 0,
      rangeEnd: n - 1,
    });

    this.quickSortHelper(arr, 0, n - 1, steps, comparisons, swaps);
    comparisons = steps[steps.length - 1].comparisons;
    swaps = steps[steps.length - 1].swaps;

    steps.push({
      type: 'done' as StepType,
      indices: Array.from({ length: n }, (_, i) => i),
      array: [...arr],
      description: '排序完成',
      codeLine: 12,
      variables: {},
      comparisons,
      swaps,
    });

    return steps;
  }

  private quickSortHelper(
    arr: number[],
    low: number,
    high: number,
    steps: SortStep[],
    comp: number,
    sw: number,
  ): void {
    let comparisons = comp;
    let swaps = sw;

    if (low < high) {
      steps.push({
        type: 'range_start' as StepType,
        indices: Array.from({ length: high - low + 1 }, (_, k) => low + k),
        array: [...arr],
        description: `处理范围 [${low}, ${high}]`,
        codeLine: 1,
        variables: { low, high },
        comparisons,
        swaps,
        rangeStart: low,
        rangeEnd: high,
      });

      const pivotIdx = this.partition(arr, low, high, steps, comparisons, swaps);
      comparisons = steps[steps.length - 1].comparisons;
      swaps = steps[steps.length - 1].swaps;

      steps.push({
        type: 'sorted' as StepType,
        indices: [pivotIdx],
        array: [...arr],
        description: `基准 arr[${pivotIdx}]=${arr[pivotIdx]} 已就位`,
        codeLine: 1,
        variables: { low, high, pivotIdx },
        comparisons,
        swaps,
      });

      this.quickSortHelper(arr, low, pivotIdx - 1, steps, comparisons, swaps);
      comparisons = steps[steps.length - 1].comparisons;
      swaps = steps[steps.length - 1].swaps;

      this.quickSortHelper(arr, pivotIdx + 1, high, steps, comparisons, swaps);
      comparisons = steps[steps.length - 1].comparisons;
      swaps = steps[steps.length - 1].swaps;

      steps.push({
        type: 'range_end' as StepType,
        indices: Array.from({ length: high - low + 1 }, (_, k) => low + k),
        array: [...arr],
        description: `范围 [${low}, ${high}] 处理完成`,
        codeLine: 4,
        variables: { low, high, pivotIdx },
        comparisons,
        swaps,
        rangeStart: low,
        rangeEnd: high,
      });
    }
  }

  private partition(
    arr: number[],
    low: number,
    high: number,
    steps: SortStep[],
    comp: number,
    sw: number,
  ): number {
    let comparisons = comp;
    let swaps = sw;
    const pivot = arr[high];

    steps.push({
      type: 'pivot' as StepType,
      indices: [high],
      values: [pivot],
      array: [...arr],
      description: `选择基准 arr[${high}]=${pivot}`,
      codeLine: 6,
      variables: { low, high, pivot, i: low - 1 },
      comparisons,
      swaps,
      rangeStart: low,
      rangeEnd: high,
    });

    let i = low - 1;

    for (let j = low; j < high; j++) {
      comparisons++;
      steps.push({
        type: 'compare' as StepType,
        indices: [j, high],
        values: [arr[j], pivot],
        array: [...arr],
        description: `比较 arr[${j}]=${arr[j]} 和 pivot=${pivot}`,
        codeLine: 9,
        variables: { low, high, pivot, i, j },
        comparisons,
        swaps,
        rangeStart: low,
        rangeEnd: high,
      });

      if (arr[j] <= pivot) {
        i++;
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
        swaps++;
        steps.push({
          type: 'swap' as StepType,
          indices: [i, j],
          values: [arr[i], arr[j]],
          array: [...arr],
          description: `交换 arr[${i}] 和 arr[${j}]`,
          codeLine: 10,
          variables: { low, high, pivot, i, j },
          comparisons,
          swaps,
          rangeStart: low,
          rangeEnd: high,
        });
      }
    }

    const temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    swaps++;

    steps.push({
      type: 'swap' as StepType,
      indices: [i + 1, high],
      values: [arr[i + 1], arr[high]],
      array: [...arr],
      description: `将基准放到位置 ${i + 1}`,
      codeLine: 11,
      variables: { low, high, pivot, i: i + 1 },
      comparisons,
      swaps,
      rangeStart: low,
      rangeEnd: high,
    });

    return i + 1;
  }

  private heapSort(arr: number[]): SortStep[] {
    const steps: SortStep[] = [];
    let comparisons = 0;
    let swaps = 0;
    const n = arr.length;

    steps.push({
      type: 'range_start' as StepType,
      indices: Array.from({ length: n }, (_, i) => i),
      array: [...arr],
      description: `初始数组，范围 [0, ${n - 1}]`,
      codeLine: 0,
      variables: { n },
      comparisons,
      swaps,
      rangeStart: 0,
      rangeEnd: n - 1,
    });

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      this.heapify(arr, n, i, steps, comparisons, swaps);
      comparisons = steps[steps.length - 1].comparisons;
      swaps = steps[steps.length - 1].swaps;
    }

    steps.push({
      type: 'range_start' as StepType,
      indices: Array.from({ length: n }, (_, k) => k),
      array: [...arr],
      description: '最大堆已建立，开始提取元素',
      codeLine: 4,
      variables: { n },
      comparisons,
      swaps,
      rangeStart: 0,
      rangeEnd: n - 1,
    });

    for (let i = n - 1; i > 0; i--) {
      const temp = arr[0];
      arr[0] = arr[i];
      arr[i] = temp;
      swaps++;

      steps.push({
        type: 'swap' as StepType,
        indices: [0, i],
        values: [arr[0], arr[i]],
        array: [...arr],
        description: `交换堆顶 arr[0]=${arr[0]} 和 arr[${i}]=${arr[i]}`,
        codeLine: 5,
        variables: { n, i },
        comparisons,
        swaps,
      });

      this.heapify(arr, i, 0, steps, comparisons, swaps);
      comparisons = steps[steps.length - 1].comparisons;
      swaps = steps[steps.length - 1].swaps;

      steps.push({
        type: 'sorted' as StepType,
        indices: [i],
        array: [...arr],
        description: `arr[${i}]=${arr[i]} 已就位`,
        codeLine: 5,
        variables: { n, i },
        comparisons,
        swaps,
      });
    }

    steps.push({
      type: 'sorted' as StepType,
      indices: [0],
      array: [...arr],
      description: `arr[0]=${arr[0]} 已就位`,
      codeLine: 5,
      variables: { n },
      comparisons,
      swaps,
    });

    steps.push({
      type: 'done' as StepType,
      indices: Array.from({ length: n }, (_, i) => i),
      array: [...arr],
      description: '排序完成',
      codeLine: 6,
      variables: {},
      comparisons,
      swaps,
    });

    return steps;
  }

  private heapify(
    arr: number[],
    n: number,
    i: number,
    steps: SortStep[],
    comp: number,
    sw: number,
  ): void {
    let comparisons = comp;
    let swaps = sw;
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n) {
      comparisons++;
      steps.push({
        type: 'compare' as StepType,
        indices: [left, largest],
        values: [arr[left], arr[largest]],
        array: [...arr],
        description: `比较 arr[${left}]=${arr[left]} 和 arr[${largest}]=${arr[largest]}`,
        codeLine: 10,
        variables: { n, i, largest, left, right },
        comparisons,
        swaps,
      });

      if (arr[left] > arr[largest]) {
        largest = left;
      }
    }

    if (right < n) {
      comparisons++;
      steps.push({
        type: 'compare' as StepType,
        indices: [right, largest],
        values: [arr[right], arr[largest]],
        array: [...arr],
        description: `比较 arr[${right}]=${arr[right]} 和 arr[${largest}]=${arr[largest]}`,
        codeLine: 12,
        variables: { n, i, largest, left, right },
        comparisons,
        swaps,
      });

      if (arr[right] > arr[largest]) {
        largest = right;
      }
    }

    if (largest !== i) {
      const temp = arr[i];
      arr[i] = arr[largest];
      arr[largest] = temp;
      swaps++;

      steps.push({
        type: 'swap' as StepType,
        indices: [i, largest],
        values: [arr[i], arr[largest]],
        array: [...arr],
        description: `交换 arr[${i}] 和 arr[${largest}]`,
        codeLine: 14,
        variables: { n, i, largest },
        comparisons,
        swaps,
      });

      this.heapify(arr, n, largest, steps, comparisons, swaps);
    }
  }

  private countingSort(arr: number[]): SortStep[] {
    const steps: SortStep[] = [];
    let comparisons = 0;
    let swaps = 0;
    const n = arr.length;

    steps.push({
      type: 'range_start' as StepType,
      indices: Array.from({ length: n }, (_, i) => i),
      array: [...arr],
      description: `初始数组，范围 [0, ${n - 1}]`,
      codeLine: 0,
      variables: { n },
      comparisons,
      swaps,
      rangeStart: 0,
      rangeEnd: n - 1,
    });

    const max = Math.max(...arr);
    const min = Math.min(...arr);
    const range = max - min + 1;

    steps.push({
      type: 'set' as StepType,
      indices: [],
      values: [max, min, range],
      array: [...arr],
      description: `最大值=${max}，最小值=${min}，范围=${range}`,
      codeLine: 1,
      variables: { n, max, min, range },
      comparisons,
      swaps,
    });

    const count = new Array(range).fill(0);
    const output = new Array(n).fill(0);

    for (let i = 0; i < n; i++) {
      count[arr[i] - min]++;
      steps.push({
        type: 'bucket_assign' as StepType,
        indices: [i],
        values: [arr[i], count[arr[i] - min]],
        array: [...arr],
        description: `计数: arr[${i}]=${arr[i]}，count[${arr[i] - min}]=${count[arr[i] - min]}`,
        codeLine: 5,
        variables: { n, i, val: arr[i], countIdx: arr[i] - min, countVal: count[arr[i] - min] },
        comparisons,
        swaps,
      });
    }

    for (let i = 1; i < range; i++) {
      count[i] += count[i - 1];
      steps.push({
        type: 'set' as StepType,
        indices: [],
        values: [count[i]],
        array: [...arr],
        description: `累计计数: count[${i}]=${count[i]}`,
        codeLine: 6,
        variables: { n, i, countVal: count[i] },
        comparisons,
        swaps,
      });
    }

    for (let i = n - 1; i >= 0; i--) {
      const countIdx = arr[i] - min;
      const outputIdx = count[countIdx] - 1;
      output[outputIdx] = arr[i];
      count[countIdx]--;

      steps.push({
        type: 'bucket_assign' as StepType,
        indices: [i, outputIdx],
        values: [arr[i], outputIdx],
        array: [...arr],
        description: `将 arr[${i}]=${arr[i]} 放入输出位置 ${outputIdx}`,
        codeLine: 8,
        variables: { n, i, val: arr[i], outputIdx, countIdx },
        comparisons,
        swaps,
      });
    }

    for (let i = 0; i < n; i++) {
      arr[i] = output[i];
      steps.push({
        type: 'overwrite' as StepType,
        indices: [i],
        values: [output[i]],
        array: [...arr],
        description: `写入 arr[${i}]=${output[i]}`,
        codeLine: 11,
        variables: { n, i, val: output[i] },
        comparisons,
        swaps,
      });
    }

    steps.push({
      type: 'done' as StepType,
      indices: Array.from({ length: n }, (_, i) => i),
      array: [...arr],
      description: '排序完成',
      codeLine: 11,
      variables: {},
      comparisons,
      swaps,
    });

    return steps;
  }

  private radixSort(arr: number[]): SortStep[] {
    const steps: SortStep[] = [];
    let comparisons = 0;
    let swaps = 0;
    const n = arr.length;

    steps.push({
      type: 'range_start' as StepType,
      indices: Array.from({ length: n }, (_, i) => i),
      array: [...arr],
      description: `初始数组，范围 [0, ${n - 1}]`,
      codeLine: 0,
      variables: { n },
      comparisons,
      swaps,
      rangeStart: 0,
      rangeEnd: n - 1,
    });

    const max = Math.max(...arr);

    steps.push({
      type: 'set' as StepType,
      indices: [],
      values: [max],
      array: [...arr],
      description: `最大值=${max}`,
      codeLine: 1,
      variables: { n, max },
      comparisons,
      swaps,
    });

    let exp = 1;
    let digitPos = 1;

    while (Math.floor(max / exp) > 0) {
      steps.push({
        type: 'digit_highlight' as StepType,
        indices: Array.from({ length: n }, (_, i) => i),
        values: arr.map(v => Math.floor(v / exp) % 10),
        array: [...arr],
        description: `按第 ${digitPos} 位（exp=${exp}）排序`,
        codeLine: 2,
        variables: { n, max, exp, digitPos },
        comparisons,
        swaps,
      });

      this.countingSortByDigit(arr, exp, steps, comparisons, swaps);
      comparisons = steps[steps.length - 1].comparisons;
      swaps = steps[steps.length - 1].swaps;

      steps.push({
        type: 'set' as StepType,
        indices: Array.from({ length: n }, (_, i) => i),
        array: [...arr],
        description: `第 ${digitPos} 位排序后的数组`,
        codeLine: 2,
        variables: { n, max, exp, digitPos },
        comparisons,
        swaps,
      });

      exp *= 10;
      digitPos++;
    }

    steps.push({
      type: 'done' as StepType,
      indices: Array.from({ length: n }, (_, i) => i),
      array: [...arr],
      description: '排序完成',
      codeLine: 14,
      variables: {},
      comparisons,
      swaps,
    });

    return steps;
  }

  private countingSortByDigit(
    arr: number[],
    exp: number,
    steps: SortStep[],
    comp: number,
    sw: number,
  ): void {
    let comparisons = comp;
    let swaps = sw;
    const n = arr.length;
    const output = new Array(n).fill(0);
    const count = new Array(10).fill(0);

    for (let i = 0; i < n; i++) {
      const digit = Math.floor(arr[i] / exp) % 10;
      count[digit]++;
      steps.push({
        type: 'digit_highlight' as StepType,
        indices: [i],
        values: [arr[i], digit],
        array: [...arr],
        description: `arr[${i}]=${arr[i]}，第 ${Math.log10(exp) + 1} 位数字=${digit}`,
        codeLine: 6,
        variables: { exp, i, val: arr[i], digit },
        comparisons,
        swaps,
      });
    }

    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1];
    }

    for (let i = n - 1; i >= 0; i--) {
      const digit = Math.floor(arr[i] / exp) % 10;
      output[count[digit] - 1] = arr[i];
      count[digit]--;

      steps.push({
        type: 'bucket_assign' as StepType,
        indices: [i, count[digit]],
        values: [arr[i], digit],
        array: [...arr],
        description: `arr[${i}]=${arr[i]} 数字=${digit}，放入输出位置 ${count[digit]}`,
        codeLine: 10,
        variables: { exp, i, val: arr[i], digit, outputIdx: count[digit] },
        comparisons,
        swaps,
      });
    }

    for (let i = 0; i < n; i++) {
      arr[i] = output[i];
      steps.push({
        type: 'overwrite' as StepType,
        indices: [i],
        values: [output[i]],
        array: [...arr],
        description: `写入 arr[${i}]=${output[i]}`,
        codeLine: 12,
        variables: { exp, i, val: output[i] },
        comparisons,
        swaps,
      });
    }
  }

  private bucketSort(arr: number[]): SortStep[] {
    const steps: SortStep[] = [];
    let comparisons = 0;
    let swaps = 0;
    const n = arr.length;

    steps.push({
      type: 'range_start' as StepType,
      indices: Array.from({ length: n }, (_, i) => i),
      array: [...arr],
      description: `初始数组，范围 [0, ${n - 1}]`,
      codeLine: 0,
      variables: { n },
      comparisons,
      swaps,
      rangeStart: 0,
      rangeEnd: n - 1,
    });

    const max = Math.max(...arr);
    const min = Math.min(...arr);
    const range = max - min + 1;
    const bucketCount = n;
    const buckets: number[][] = Array.from({ length: bucketCount }, () => []);

    steps.push({
      type: 'set' as StepType,
      indices: [],
      values: [max, min, bucketCount],
      array: [...arr],
      description: `最大值=${max}，最小值=${min}，桶数=${bucketCount}`,
      codeLine: 1,
      variables: { n, max, min, bucketCount },
      comparisons,
      swaps,
    });

    for (let i = 0; i < n; i++) {
      let bucketIdx: number;
      if (range === 0) {
        bucketIdx = 0;
      } else {
        bucketIdx = Math.min(Math.floor((arr[i] - min) / range * n), n - 1);
      }
      buckets[bucketIdx].push(arr[i]);

      steps.push({
        type: 'bucket_assign' as StepType,
        indices: [i],
        values: [arr[i], bucketIdx],
        array: [...arr],
        description: `arr[${i}]=${arr[i]} 分配到桶 ${bucketIdx}`,
        codeLine: 4,
        variables: { n, i, val: arr[i], bucketIdx },
        comparisons,
        swaps,
      });
    }

    for (let i = 0; i < bucketCount; i++) {
      if (buckets[i].length > 1) {
        const bucketCopy = [...buckets[i]];
        for (let a = 1; a < bucketCopy.length; a++) {
          const key = bucketCopy[a];
          let b = a - 1;
          while (b >= 0) {
            comparisons++;
            if (bucketCopy[b] > key) {
              bucketCopy[b + 1] = bucketCopy[b];
              swaps++;
              b--;
            } else {
              break;
            }
          }
          bucketCopy[b + 1] = key;
        }
        buckets[i] = bucketCopy;
      }

      if (buckets[i].length > 0) {
        steps.push({
          type: 'set' as StepType,
          indices: [],
          values: buckets[i],
          array: [...arr],
          description: `桶 ${i} 排序完成: [${buckets[i].join(', ')}]`,
          codeLine: 6,
          variables: { n, bucketIdx: i, bucketContents: [...buckets[i]] },
          comparisons,
          swaps,
        });
      }
    }

    let k = 0;
    for (let i = 0; i < bucketCount; i++) {
      for (let j = 0; j < buckets[i].length; j++) {
        arr[k] = buckets[i][j];
        steps.push({
          type: 'overwrite' as StepType,
          indices: [k],
          values: [buckets[i][j]],
          array: [...arr],
          description: `从桶 ${i} 取出 ${buckets[i][j]}，放入位置 ${k}`,
          codeLine: 9,
          variables: { n, k, bucketIdx: i, val: buckets[i][j] },
          comparisons,
          swaps,
        });
        k++;
      }
    }

    steps.push({
      type: 'done' as StepType,
      indices: Array.from({ length: n }, (_, i) => i),
      array: [...arr],
      description: '排序完成',
      codeLine: 10,
      variables: {},
      comparisons,
      swaps,
    });

    return steps;
  }
}
