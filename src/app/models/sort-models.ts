export type StepType =
  | 'compare'
  | 'swap'
  | 'set'
  | 'sorted'
  | 'pivot'
  | 'range_start'
  | 'range_end'
  | 'done'
  | 'overwrite'
  | 'bucket_assign'
  | 'digit_highlight';

export interface SortStep {
  type: StepType;
  indices: number[];
  values?: number[];
  array: number[];
  description: string;
  codeLine: number;
  variables: Record<string, any>;
  comparisons: number;
  swaps: number;
  rangeStart?: number;
  rangeEnd?: number;
}

export interface AlgorithmInfo {
  id: string;
  name: string;
  nameCn: string;
  description: string;
  bestTime: string;
  avgTime: string;
  worstTime: string;
  space: string;
  stable: boolean;
  pseudocode: string[];
  applicableScenario: string;
}

export interface SortState {
  array: number[];
  comparing: number[];
  swapping: number[];
  sorted: Set<number>;
  pivot: number;
  rangeStart: number;
  rangeEnd: number;
  currentStep: number;
  totalSteps: number;
  comparisons: number;
  swaps: number;
  isRunning: boolean;
  isPaused: boolean;
  isComplete: boolean;
  codeLine: number;
  variables: Record<string, any>;
}

export type DataDistribution = 'random' | 'nearly-sorted' | 'reversed' | 'duplicates' | 'custom';

export type ThemeId = 'dark' | 'light' | 'high-contrast';

export interface ThemeColors {
  id: ThemeId;
  name: string;
  appBg: string;
  appColor: string;
  panelBg: string;
  panelHeaderBg: string;
  buttonBg: string;
  buttonActiveBg: string;
  buttonColor: string;
  buttonActiveColor: string;
  inputBg: string;
  inputColor: string;
  inputBorder: string;
  tableHeaderBg: string;
  tableHeaderColor: string;
  tableBorder: string;
  tableActiveBg: string;
  scrollbarTrack: string;
  scrollbarThumb: string;
  chartBg: string;
  chartAxisColor: string;
  chartGridColor: string;
  barDefault: string;
  barComparing: string;
  barSwapping: string;
  barSorted: string;
  barPivot: string;
  barRange: string;
  highlightColor: string;
  accentColor: string;
  successColor: string;
  warningColor: string;
  dangerColor: string;
  textPrimary: string;
  textSecondary: string;
  labelColor: string;
  barTextColor: string;
}

export const THEMES: Record<ThemeId, ThemeColors> = {
  dark: {
    id: 'dark',
    name: '深色模式',
    appBg: '#1a1a2e',
    appColor: '#e0e0e0',
    panelBg: '#16213e',
    panelHeaderBg: '#0f3460',
    buttonBg: '#0f3460',
    buttonActiveBg: '#5B8DEF',
    buttonColor: '#e0e0e0',
    buttonActiveColor: '#ffffff',
    inputBg: '#0f3460',
    inputColor: '#ffffff',
    inputBorder: '#333333',
    tableHeaderBg: '#0f3460',
    tableHeaderColor: '#5B8DEF',
    tableBorder: '#333333',
    tableActiveBg: '#5B8DEF22',
    scrollbarTrack: '#1a1a2e',
    scrollbarThumb: '#333333',
    chartBg: '#0f3460',
    chartAxisColor: '#333333',
    chartGridColor: '#E0E0E0',
    barDefault: '#5B8DEF',
    barComparing: '#FF9800',
    barSwapping: '#F44336',
    barSorted: '#4CAF50',
    barPivot: '#9C27B0',
    barRange: 'rgba(255, 235, 59, 0.15)',
    highlightColor: '#5B8DEF33',
    accentColor: '#5B8DEF',
    successColor: '#4CAF50',
    warningColor: '#FF9800',
    dangerColor: '#F44336',
    textPrimary: '#ffffff',
    textSecondary: '#e0e0e0',
    labelColor: '#888888',
    barTextColor: '#333333',
  },
  light: {
    id: 'light',
    name: '浅色模式',
    appBg: '#f5f7fa',
    appColor: '#2c3e50',
    panelBg: '#ffffff',
    panelHeaderBg: '#e8ecf1',
    buttonBg: '#e8ecf1',
    buttonActiveBg: '#4A90D9',
    buttonColor: '#2c3e50',
    buttonActiveColor: '#ffffff',
    inputBg: '#ffffff',
    inputColor: '#2c3e50',
    inputBorder: '#cbd5e0',
    tableHeaderBg: '#e8ecf1',
    tableHeaderColor: '#4A90D9',
    tableBorder: '#e2e8f0',
    tableActiveBg: '#4A90D922',
    scrollbarTrack: '#e8ecf1',
    scrollbarThumb: '#a0aec0',
    chartBg: '#f0f4f8',
    chartAxisColor: '#2c3e50',
    chartGridColor: '#e2e8f0',
    barDefault: '#6BB6FF',
    barComparing: '#FFB74D',
    barSwapping: '#EF5350',
    barSorted: '#66BB6A',
    barPivot: '#AB47BC',
    barRange: 'rgba(255, 193, 7, 0.20)',
    highlightColor: '#4A90D922',
    accentColor: '#4A90D9',
    successColor: '#43A047',
    warningColor: '#FB8C00',
    dangerColor: '#E53935',
    textPrimary: '#1a202c',
    textSecondary: '#4a5568',
    labelColor: '#718096',
    barTextColor: '#555555',
  },
  'high-contrast': {
    id: 'high-contrast',
    name: '高对比度模式',
    appBg: '#000000',
    appColor: '#ffffff',
    panelBg: '#0a0a0a',
    panelHeaderBg: '#1a1a1a',
    buttonBg: '#1a1a1a',
    buttonActiveBg: '#00FF88',
    buttonColor: '#ffffff',
    buttonActiveColor: '#000000',
    inputBg: '#1a1a1a',
    inputColor: '#00FF88',
    inputBorder: '#00FF88',
    tableHeaderBg: '#1a1a1a',
    tableHeaderColor: '#00FF88',
    tableBorder: '#00FF88',
    tableActiveBg: '#00FF8833',
    scrollbarTrack: '#000000',
    scrollbarThumb: '#00FF88',
    chartBg: '#1a1a1a',
    chartAxisColor: '#00FF88',
    chartGridColor: '#333333',
    barDefault: '#00BFFF',
    barComparing: '#FFD700',
    barSwapping: '#FF0066',
    barSorted: '#00FF88',
    barPivot: '#FF00FF',
    barRange: 'rgba(255, 215, 0, 0.25)',
    highlightColor: '#00FF8844',
    accentColor: '#00FF88',
    successColor: '#00FF88',
    warningColor: '#FFD700',
    dangerColor: '#FF0066',
    textPrimary: '#ffffff',
    textSecondary: '#e0e0e0',
    labelColor: '#aaaaaa',
    barTextColor: '#ffffff',
  },
};

export interface HistoryRecord {
  id: string;
  timestamp: number;
  algorithmId: string;
  algorithmNameCn: string;
  arrayLength: number;
  distribution: DataDistribution;
  distributionLabel: string;
  totalComparisons: number;
  totalSwaps: number;
  totalSteps: number;
  originalArray: number[];
  isDualMode: boolean;
  secondAlgorithmId?: string;
  secondAlgorithmNameCn?: string;
  secondTotalComparisons?: number;
  secondTotalSwaps?: number;
  secondTotalSteps?: number;
}

export const DISTRIBUTION_LABELS: Record<DataDistribution, string> = {
  random: '完全随机',
  'nearly-sorted': '近乎有序',
  reversed: '完全逆序',
  duplicates: '大量重复值',
  custom: '自定义输入',
};

export const ALGORITHMS: AlgorithmInfo[] = [
  {
    id: 'bubble',
    name: 'Bubble Sort',
    nameCn: '冒泡排序',
    description: '重复遍历数组，比较相邻元素，若顺序错误则交换。每轮将最大元素"冒泡"到末尾。',
    bestTime: 'O(n)',
    avgTime: 'O(n²)',
    worstTime: 'O(n²)',
    space: 'O(1)',
    stable: true,
    applicableScenario: '小规模数据或近乎有序的数据',
    pseudocode: [
      'function bubbleSort(arr):',
      '  n = arr.length',
      '  for i = 0 to n-1:',
      '    for j = 0 to n-i-2:',
      '      if arr[j] > arr[j+1]:',
      '        swap(arr[j], arr[j+1])',
      '  return arr',
    ],
  },
  {
    id: 'selection',
    name: 'Selection Sort',
    nameCn: '选择排序',
    description: '每轮从未排序部分选出最小元素，放到已排序部分的末尾。',
    bestTime: 'O(n²)',
    avgTime: 'O(n²)',
    worstTime: 'O(n²)',
    space: 'O(1)',
    stable: false,
    applicableScenario: '小规模数据，交换操作代价高的场景',
    pseudocode: [
      'function selectionSort(arr):',
      '  n = arr.length',
      '  for i = 0 to n-1:',
      '    minIdx = i',
      '    for j = i+1 to n-1:',
      '      if arr[j] < arr[minIdx]:',
      '        minIdx = j',
      '    swap(arr[i], arr[minIdx])',
      '  return arr',
    ],
  },
  {
    id: 'insertion',
    name: 'Insertion Sort',
    nameCn: '插入排序',
    description: '将每个元素插入到已排序部分的正确位置，类似整理扑克牌。',
    bestTime: 'O(n)',
    avgTime: 'O(n²)',
    worstTime: 'O(n²)',
    space: 'O(1)',
    stable: true,
    applicableScenario: '小规模或近乎有序的数据，在线算法',
    pseudocode: [
      'function insertionSort(arr):',
      '  n = arr.length',
      '  for i = 1 to n-1:',
      '    key = arr[i]',
      '    j = i - 1',
      '    while j >= 0 and arr[j] > key:',
      '      arr[j+1] = arr[j]',
      '      j = j - 1',
      '    arr[j+1] = key',
      '  return arr',
    ],
  },
  {
    id: 'shell',
    name: 'Shell Sort',
    nameCn: '希尔排序',
    description: '插入排序的改进版，先按较大间隔分组排序，逐步缩小间隔至1，最终进行一次标准插入排序。',
    bestTime: 'O(n log n)',
    avgTime: 'O(n^1.3)',
    worstTime: 'O(n²)',
    space: 'O(1)',
    stable: false,
    applicableScenario: '中等规模数据，对稳定性无要求',
    pseudocode: [
      'function shellSort(arr):',
      '  n = arr.length',
      '  gap = n / 2',
      '  while gap > 0:',
      '    for i = gap to n-1:',
      '      temp = arr[i]',
      '      j = i',
      '      while j >= gap and arr[j-gap] > temp:',
      '        arr[j] = arr[j-gap]',
      '        j = j - gap',
      '      arr[j] = temp',
      '    gap = gap / 2',
      '  return arr',
    ],
  },
  {
    id: 'merge',
    name: 'Merge Sort',
    nameCn: '归并排序',
    description: '分治法：将数组递归地分成两半，分别排序后合并。稳定且时间复杂度恒为O(n log n)。',
    bestTime: 'O(n log n)',
    avgTime: 'O(n log n)',
    worstTime: 'O(n log n)',
    space: 'O(n)',
    stable: true,
    applicableScenario: '大规模数据，需要稳定排序，链表排序',
    pseudocode: [
      'function mergeSort(arr, left, right):',
      '  if left < right:',
      '    mid = (left + right) / 2',
      '    mergeSort(arr, left, mid)',
      '    mergeSort(arr, mid+1, right)',
      '    merge(arr, left, mid, right)',
      '',
      'function merge(arr, l, m, r):',
      '  copy left and right subarrays',
      '  i=0, j=0, k=l',
      '  while i < L.len and j < R.len:',
      '    if L[i] <= R[j]: arr[k++] = L[i++]',
      '    else: arr[k++] = R[j++]',
      '  copy remaining elements',
    ],
  },
  {
    id: 'quick',
    name: 'Quick Sort',
    nameCn: '快速排序',
    description: '分治法：选择基准元素(pivot)，将数组分为小于和大于基准的两部分，递归排序。平均性能最优。',
    bestTime: 'O(n log n)',
    avgTime: 'O(n log n)',
    worstTime: 'O(n²)',
    space: 'O(log n)',
    stable: false,
    applicableScenario: '大规模数据，平均性能最优，内存敏感场景',
    pseudocode: [
      'function quickSort(arr, low, high):',
      '  if low < high:',
      '    pivotIdx = partition(arr, low, high)',
      '    quickSort(arr, low, pivotIdx - 1)',
      '    quickSort(arr, pivotIdx + 1, high)',
      '',
      'function partition(arr, low, high):',
      '  pivot = arr[high]',
      '  i = low - 1',
      '  for j = low to high-1:',
      '    if arr[j] <= pivot:',
      '      i++; swap(arr[i], arr[j])',
      '  swap(arr[i+1], arr[high])',
      '  return i + 1',
    ],
  },
  {
    id: 'heap',
    name: 'Heap Sort',
    nameCn: '堆排序',
    description: '利用最大堆数据结构，先建堆再逐步取出堆顶最大元素放到末尾。时间复杂度恒为O(n log n)。',
    bestTime: 'O(n log n)',
    avgTime: 'O(n log n)',
    worstTime: 'O(n log n)',
    space: 'O(1)',
    stable: false,
    applicableScenario: '大规模数据，需要保证最坏情况性能',
    pseudocode: [
      'function heapSort(arr):',
      '  n = arr.length',
      '  // Build max heap',
      '  for i = n/2-1 downto 0:',
      '    heapify(arr, n, i)',
      '  // Extract elements',
      '  for i = n-1 downto 1:',
      '    swap(arr[0], arr[i])',
      '    heapify(arr, i, 0)',
      '',
      'function heapify(arr, n, i):',
      '  largest = i',
      '  left = 2*i + 1, right = 2*i + 2',
      '  if left < n and arr[left] > arr[largest]:',
      '    largest = left',
      '  if right < n and arr[right] > arr[largest]:',
      '    largest = right',
      '  if largest != i:',
      '    swap(arr[i], arr[largest])',
      '    heapify(arr, n, largest)',
    ],
  },
  {
    id: 'counting',
    name: 'Counting Sort',
    nameCn: '计数排序',
    description: '统计每个值出现的次数，通过计数确定每个元素在输出中的位置。非比较排序，时间复杂度O(n+k)。',
    bestTime: 'O(n+k)',
    avgTime: 'O(n+k)',
    worstTime: 'O(n+k)',
    space: 'O(k)',
    stable: true,
    applicableScenario: '整数且值域范围(k)不大的数据',
    pseudocode: [
      'function countingSort(arr):',
      '  max = max(arr), min = min(arr)',
      '  range = max - min + 1',
      '  count = new Array(range)',
      '  output = new Array(arr.length)',
      '  for i = 0 to arr.length-1:',
      '    count[arr[i]-min]++',
      '  for i = 1 to range-1:',
      '    count[i] += count[i-1]',
      '  for i = arr.length-1 downto 0:',
      '    output[count[arr[i]-min]-1] = arr[i]',
      '    count[arr[i]-min]--',
      '  copy output to arr',
    ],
  },
  {
    id: 'radix',
    name: 'Radix Sort',
    nameCn: '基数排序',
    description: '按位排序：从最低位到最高位，对每一位使用稳定排序(如计数排序)。非比较排序。',
    bestTime: 'O(d(n+k))',
    avgTime: 'O(d(n+k))',
    worstTime: 'O(d(n+k))',
    space: 'O(n+k)',
    stable: true,
    applicableScenario: '整数或定长字符串，位数不多时效率极高',
    pseudocode: [
      'function radixSort(arr):',
      '  max = max(arr)',
      '  for exp = 1; max/exp > 0; exp *= 10:',
      '    countingSortByDigit(arr, exp)',
      '',
      'function countingSortByDigit(arr, exp):',
      '  count = new Array(10)',
      '  output = new Array(arr.length)',
      '  for i = 0 to arr.length-1:',
      '    digit = (arr[i]/exp) % 10',
      '    count[digit]++',
      '  for i = 1 to 9:',
      '    count[i] += count[i-1]',
      '  for i = arr.length-1 downto 0:',
      '    digit = (arr[i]/exp) % 10',
      '    output[count[digit]-1] = arr[i]',
      '    count[digit]--',
      '  copy output to arr',
    ],
  },
  {
    id: 'bucket',
    name: 'Bucket Sort',
    nameCn: '桶排序',
    description: '将元素分到有限数量的桶中，每个桶内单独排序(通常用插入排序)，最后合并所有桶。',
    bestTime: 'O(n+k)',
    avgTime: 'O(n+k)',
    worstTime: 'O(n²)',
    space: 'O(n+k)',
    stable: true,
    applicableScenario: '均匀分布的数据，值域已知',
    pseudocode: [
      'function bucketSort(arr):',
      '  n = arr.length',
      '  buckets = new Array(n) of lists',
      '  for i = 0 to n-1:',
      '    idx = floor(n * arr[i] / (max+1))',
      '    buckets[idx].add(arr[i])',
      '  for i = 0 to n-1:',
      '    insertionSort(buckets[i])',
      '  k = 0',
      '  for i = 0 to n-1:',
      '    for val in buckets[i]:',
      '      arr[k++] = val',
      '  return arr',
    ],
  },
];
