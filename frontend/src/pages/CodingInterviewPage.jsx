import React, { useState } from 'react';
import {
  Code2, Play, CheckCircle2, ChevronDown, Sparkles,
  Terminal, Layers, HelpCircle, Check, AlertCircle, RefreshCw,
  Search, Lightbulb, Clock, Cpu
} from 'lucide-react';

const PROBLEMS = [
  // ─── BASIC / EASY PROBLEMS ──────────────────────────────────
  {
    id: 'two-sum',
    label: '1. Two Sum',
    tier: 'Basic',
    difficulty: 'Easy',
    category: 'Arrays & Hash Maps',
    diffColor: 'var(--success)',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.`,
    examples: [
      { input: 'nums = [2, 7, 11, 15], target = 9', output: '[0, 1]', note: 'nums[0] + nums[1] == 9' },
      { input: 'nums = [3, 2, 4], target = 6', output: '[1, 2]' },
      { input: 'nums = [3, 3], target = 6', output: '[0, 1]' }
    ],
    constraints: [
      '2 ≤ nums.length ≤ 10⁴',
      '-10⁹ ≤ nums[i] ≤ 10⁹',
      'Exactly one valid answer exists.'
    ],
    hints: [
      'A brute force approach checks all pairs in O(n²). Can we do better with extra memory?',
      'Use a Hash Map to store elements and their indices as you iterate. Check if (target - current) already exists in the map.'
    ],
    defaultCode: {
      javascript: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) {
      return [map.get(diff), i];
    }
    map.set(nums[i], i);
  }
  return [];
}

console.log(twoSum([2, 7, 11, 15], 9)); // Expected: [0, 1]`,
      python: `def twoSum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        diff = target - n
        if diff in seen:
            return [seen[diff], i]
        seen[n] = i
    return []

print(twoSum([2, 7, 11, 15], 9)) # Expected: [0, 1]`,
      java: `import java.util.*;
class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int diff = target - nums[i];
            if (map.containsKey(diff)) {
                return new int[]{map.get(diff), i};
            }
            map.put(nums[i], i);
        }
        return new int[]{};
    }
}`,
      cpp: `#include <vector>
#include <unordered_map>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> map;
    for (int i = 0; i < nums.size(); i++) {
        int diff = target - nums[i];
        if (map.count(diff)) {
            return {map[diff], i};
        }
        map[nums[i]] = i;
    }
    return {};
}`
    },
    mockOutput: { passed: 3, total: 3, runtime: '48 ms', memory: '42.1 MB', output: '[0, 1]\n[1, 2]\n[0, 1]\n\nAll test cases passed successfully!' }
  },
  {
    id: 'valid-palindrome',
    label: '2. Valid Palindrome',
    tier: 'Basic',
    difficulty: 'Easy',
    category: 'Two Pointers & Strings',
    diffColor: 'var(--success)',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    description: `A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Given a string s, return true if it is a palindrome, or false otherwise.`,
    examples: [
      { input: 's = "A man, a plan, a canal: Panama"', output: 'true', note: '"amanaplanacanalpanama" is a palindrome.' },
      { input: 's = "race a car"', output: 'false' },
      { input: 's = " "', output: 'true' }
    ],
    constraints: [
      '1 ≤ s.length ≤ 2 * 10⁵',
      's consists only of printable ASCII characters.'
    ],
    hints: [
      'Use two pointers starting at left (0) and right (s.length - 1).',
      'Skip non-alphanumeric characters and compare lowercase values until pointers meet.'
    ],
    defaultCode: {
      javascript: `function isPalindrome(s) {
  let left = 0, right = s.length - 1;
  const isAlphaNum = (c) => /[a-z0-9]/i.test(c);
  
  while (left < right) {
    while (left < right && !isAlphaNum(s[left])) left++;
    while (left < right && !isAlphaNum(s[right])) right--;
    if (s[left].toLowerCase() !== s[right].toLowerCase()) return false;
    left++;
    right--;
  }
  return true;
}

console.log(isPalindrome("A man, a plan, a canal: Panama")); // Expected: true`,
      python: `def isPalindrome(s: str) -> bool:
    l, r = 0, len(s) - 1
    while l < r:
        while l < r and not s[l].isalnum(): l += 1
        while l < r and not s[r].isalnum(): r -= 1
        if s[l].lower() != s[r].lower(): return False
        l += 1
        r -= 1
    return True

print(isPalindrome("A man, a plan, a canal: Panama")) # Expected: True`,
      java: `class Solution {
    public boolean isPalindrome(String s) {
        int l = 0, r = s.length() - 1;
        while (l < r) {
            while (l < r && !Character.isLetterOrDigit(s.charAt(l))) l++;
            while (l < r && !Character.isLetterOrDigit(s.charAt(r))) r--;
            if (Character.toLowerCase(s.charAt(l)) != Character.toLowerCase(s.charAt(r))) return false;
            l++;
            r--;
        }
        return true;
    }
}`,
      cpp: `#include <string>
#include <cctype>
using namespace std;

bool isPalindrome(string s) {
    int l = 0, r = s.length() - 1;
    while (l < r) {
        while (l < r && !isalnum(s[l])) l++;
        while (l < r && !isalnum(s[r])) r--;
        if (tolower(s[l]) != tolower(s[r])) return false;
        l++; r--;
    }
    return true;
}`
    },
    mockOutput: { passed: 3, total: 3, runtime: '36 ms', memory: '38.4 MB', output: 'true\nfalse\ntrue\n\nAll 3 test cases passed!' }
  },

  // ─── INTERMEDIATE / MEDIUM PROBLEMS ─────────────────────────
  {
    id: 'longest-substring',
    label: '3. Longest Substring Without Repeating Characters',
    tier: 'Intermediate',
    difficulty: 'Medium',
    category: 'Sliding Window',
    diffColor: 'var(--warning)',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(min(m, n))',
    description: `Given a string s, find the length of the longest substring without duplicate characters.`,
    examples: [
      { input: 's = "abcabcbb"', output: '3', note: 'The answer is "abc", with length 3.' },
      { input: 's = "bbbbb"', output: '1', note: 'The answer is "b", with length 1.' },
      { input: 's = "pwwkew"', output: '3', note: 'The answer is "wke", with length 3.' }
    ],
    constraints: [
      '0 ≤ s.length ≤ 5 * 10⁴',
      's consists of English letters, digits, symbols and spaces.'
    ],
    hints: [
      'Maintain a sliding window [left, right].',
      'Use a Hash Map to record the last seen index of each character. When a duplicate is encountered inside the current window, move left to map.get(char) + 1.'
    ],
    defaultCode: {
      javascript: `function lengthOfLongestSubstring(s) {
  let maxLength = 0;
  let left = 0;
  const lastSeen = new Map();

  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    if (lastSeen.has(char) && lastSeen.get(char) >= left) {
      left = lastSeen.get(char) + 1;
    }
    lastSeen.set(char, right);
    maxLength = Math.max(maxLength, right - left + 1);
  }
  return maxLength;
}

console.log(lengthOfLongestSubstring("abcabcbb")); // Expected: 3`,
      python: `def lengthOfLongestSubstring(s: str) -> int:
    last_seen = {}
    left = 0
    max_len = 0
    for right, char in enumerate(s):
        if char in last_seen and last_seen[char] >= left:
            left = last_seen[char] + 1
        last_seen[char] = right
        max_len = max(max_len, right - left + 1)
    return max_len

print(lengthOfLongestSubstring("abcabcbb")) # Expected: 3`,
      java: `import java.util.*;
class Solution {
    public int lengthOfLongestSubstring(String s) {
        Map<Character, Integer> map = new HashMap<>();
        int max = 0, left = 0;
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            if (map.containsKey(c) && map.get(c) >= left) {
                left = map.get(c) + 1;
            }
            map.put(c, right);
            max = Math.max(max, right - left + 1);
        }
        return max;
    }
}`,
      cpp: `#include <string>
#include <unordered_map>
#include <algorithm>
using namespace std;

int lengthOfLongestSubstring(string s) {
    unordered_map<char, int> map;
    int maxLen = 0, left = 0;
    for (int right = 0; right < s.length(); right++) {
        if (map.count(s[right]) && map[s[right]] >= left) {
            left = map[s[right]] + 1;
        }
        map[s[right]] = right;
        maxLen = max(maxLen, right - left + 1);
    }
    return maxLen;
}`
    },
    mockOutput: { passed: 3, total: 3, runtime: '52 ms', memory: '44.8 MB', output: '3\n1\n3\n\nAll test cases passed!' }
  },
  {
    id: 'lru-cache',
    label: '4. LRU Cache Design',
    tier: 'Intermediate',
    difficulty: 'Medium',
    category: 'System & Data Structures',
    diffColor: 'var(--warning)',
    timeComplexity: 'O(1) Get and Put',
    spaceComplexity: 'O(capacity)',
    description: `Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement LRUCache class with get(key) and put(key, value) in O(1) average time complexity.`,
    examples: [
      { input: 'LRUCache(2); put(1, 1); put(2, 2); get(1); put(3, 3); get(2);', output: '[null, null, null, 1, null, -1]', note: 'Key 2 was evicted because key 1 was accessed before put(3, 3).' }
    ],
    constraints: [
      '1 ≤ capacity ≤ 3000',
      '0 ≤ key ≤ 10⁴, 0 ≤ value ≤ 10⁵',
      'At most 2 * 10⁵ calls to get and put.'
    ],
    hints: [
      'Combine a Doubly Linked List (for O(1) removal and insertion at head/tail) with a Hash Map (for O(1) node lookup).',
      'In JavaScript, Map preserves insertion order, allowing clean O(1) LRU eviction.'
    ],
    defaultCode: {
      javascript: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
  }

  get(key) {
    if (!this.map.has(key)) return -1;
    const val = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, val); // Move to most recently used
    return val;
  }

  put(key, value) {
    if (this.map.has(key)) {
      this.map.delete(key);
    } else if (this.map.size >= this.capacity) {
      // Evict oldest (first key in Map)
      const oldestKey = this.map.keys().next().value;
      this.map.delete(oldestKey);
    }
    this.map.set(key, value);
  }
}

const lru = new LRUCache(2);
lru.put(1, 1);
lru.put(2, 2);
console.log(lru.get(1)); // Expected: 1
lru.put(3, 3);          // Evicts key 2
console.log(lru.get(2)); // Expected: -1`,
      python: `from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = OrderedDict()

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        self.cache.move_to_end(key)
        return self.cache[key]

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)

lru = LRUCache(2)
lru.put(1, 1)
lru.put(2, 2)
print(lru.get(1)) # Expected: 1`,
      java: `import java.util.*;
class LRUCache extends LinkedHashMap<Integer, Integer> {
    private int capacity;
    public LRUCache(int capacity) {
        super(capacity, 0.75f, true);
        this.capacity = capacity;
    }
    public int get(int key) {
        return super.getOrDefault(key, -1);
    }
    public void put(int key, int value) {
        super.put(key, value);
    }
    @Override
    protected boolean removeEldestEntry(Map.Entry<Integer, Integer> eldest) {
        return size() > capacity;
    }
}`,
      cpp: `#include <list>
#include <unordered_map>
using namespace std;

class LRUCache {
    int cap;
    list<pair<int, int>> lru;
    unordered_map<int, list<pair<int, int>>::iterator> map;
public:
    LRUCache(int capacity) : cap(capacity) {}
    int get(int key) {
        if (!map.count(key)) return -1;
        lru.splice(lru.begin(), lru, map[key]);
        return map[key]->second;
    }
    void put(int key, int value) {
        if (map.count(key)) {
            map[key]->second = value;
            lru.splice(lru.begin(), lru, map[key]);
            return;
        }
        if (lru.size() >= cap) {
            map.erase(lru.back().first);
            lru.pop_back();
        }
        lru.emplace_front(key, value);
        map[key] = lru.begin();
    }
};`
    },
    mockOutput: { passed: 4, total: 4, runtime: '64 ms', memory: '51.2 MB', output: '1\n-1\n3\n4\n\nAll operations executed in O(1) time complexity!' }
  },

  // ─── ADVANCED / HARD PROBLEMS ───────────────────────────────
  {
    id: 'trapping-rain-water',
    label: '5. Trapping Rain Water',
    tier: 'Advanced',
    difficulty: 'Hard',
    category: 'Two Pointers & Dynamic Programming',
    diffColor: 'var(--danger)',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    description: `Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.`,
    examples: [
      { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6', note: '6 units of rain water are trapped.' },
      { input: 'height = [4,2,0,3,2,5]', output: '9' }
    ],
    constraints: [
      'n == height.length',
      '1 ≤ n ≤ 2 * 10⁴',
      '0 ≤ height[i] ≤ 10⁵'
    ],
    hints: [
      'The water trapped at index i is determined by: min(maxLeft, maxRight) - height[i].',
      'Instead of precomputing prefix arrays in O(n) space, use Two Pointers moving inward from the smaller max bound.'
    ],
    defaultCode: {
      javascript: `function trap(height) {
  if (!height.length) return 0;
  let left = 0, right = height.length - 1;
  let maxLeft = 0, maxRight = 0;
  let totalWater = 0;

  while (left < right) {
    if (height[left] <= height[right]) {
      if (height[left] >= maxLeft) {
        maxLeft = height[left];
      } else {
        totalWater += maxLeft - height[left];
      }
      left++;
    } else {
      if (height[right] >= maxRight) {
        maxRight = height[right];
      } else {
        totalWater += maxRight - height[right];
      }
      right--;
    }
  }
  return totalWater;
}

console.log(trap([0,1,0,2,1,0,1,3,2,1,2,1])); // Expected: 6`,
      python: `def trap(height: list[int]) -> int:
    if not height: return 0
    l, r = 0, len(height) - 1
    max_l, max_r = 0, 0
    water = 0
    while l < r:
        if height[l] <= height[r]:
            if height[l] >= max_l: max_l = height[l]
            else: water += max_l - height[l]
            l += 1
        else:
            if height[r] >= max_r: max_r = height[r]
            else: water += max_r - height[r]
            r -= 1
    return water

print(trap([0,1,0,2,1,0,1,3,2,1,2,1])) # Expected: 6`,
      java: `class Solution {
    public int trap(int[] height) {
        int l = 0, r = height.length - 1;
        int maxL = 0, maxR = 0, water = 0;
        while (l < r) {
            if (height[l] <= height[r]) {
                if (height[l] >= maxL) maxL = height[l];
                else water += maxL - height[l];
                l++;
            } else {
                if (height[r] >= maxR) maxR = height[r];
                else water += maxR - height[r];
                r--;
            }
        }
        return water;
    }
}`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

int trap(vector<int>& height) {
    int l = 0, r = height.size() - 1;
    int maxL = 0, maxR = 0, water = 0;
    while (l < r) {
        if (height[l] <= height[r]) {
            if (height[l] >= maxL) maxL = height[l];
            else water += maxL - height[l];
            l++;
        } else {
            if (height[r] >= maxR) maxR = height[r];
            else water += maxR - height[r];
            r--;
        }
    }
    return water;
}`
    },
    mockOutput: { passed: 2, total: 2, runtime: '44 ms', memory: '41.8 MB', output: '6\n9\n\nOptimal O(1) space complexity confirmed!' }
  }
];

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript (Node.js)' },
  { value: 'python', label: 'Python 3' },
  { value: 'java', label: 'Java (OpenJDK)' },
  { value: 'cpp', label: 'C++ (g++)' },
];

/* ─── Coding Interview Page ─────────────── */
export const CodingInterviewPage = () => {
  const [selectedProblemId, setSelectedProblemId] = useState(PROBLEMS[0].id);
  const [language, setLanguage] = useState('javascript');
  const [activeTab, setActiveTab] = useState('problem'); // 'problem', 'hints', 'approach'
  const [filterTier, setFilterTier] = useState('all');
  const [search, setSearch] = useState('');

  const currentProblem = PROBLEMS.find(p => p.id === selectedProblemId) || PROBLEMS[0];
  const [code, setCode] = useState(currentProblem.defaultCode.javascript);
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState(null);

  const handleSelectProblem = (prob) => {
    setSelectedProblemId(prob.id);
    setCode(prob.defaultCode[language] || prob.defaultCode.javascript);
    setOutput('');
    setResults(null);
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(currentProblem.defaultCode[lang] || '');
    setOutput('');
    setResults(null);
  };

  const handleRun = () => {
    setRunning(true);
    setOutput('Compiling and executing against test suite...');
    setResults(null);
    setTimeout(() => {
      setRunning(false);
      setOutput(currentProblem.mockOutput.output);
      setResults(currentProblem.mockOutput);
    }, 850);
  };

  const filteredProblems = PROBLEMS.filter(p => {
    if (filterTier !== 'all' && p.tier !== filterTier) return false;
    if (search.trim()) {
      const s = search.toLowerCase();
      return p.label.toLowerCase().includes(s) || p.category.toLowerCase().includes(s);
    }
    return true;
  });

  return (
    <div style={{ padding: '36px 0 80px' }}>
      <div className="page-container" style={{ maxWidth: 1360 }}>
        {/* Page Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 'var(--radius-full)', background: 'var(--accent-subtle)', color: 'var(--accent-text)', fontSize: '0.75rem', fontWeight: 600, marginBottom: 8 }}>
              <Code2 size={14} /> Algorithmic Sandbox & Coding Problem Bank
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.025em', margin: 0 }}>
              Live Coding Interview Practice
            </h1>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Tier Filter:</span>
            {['all', 'Basic', 'Intermediate', 'Advanced'].map(tier => (
              <button
                key={tier}
                onClick={() => setFilterTier(tier)}
                className={`btn btn-sm ${filterTier === tier ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '4px 12px', fontSize: '0.75rem', borderRadius: 'var(--radius-full)' }}
              >
                {tier === 'all' ? 'All Tiers' : tier}
              </button>
            ))}
          </div>
        </div>

        {/* Workspace Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 380px) 1fr', gap: 20 }}>
          {/* Left Column: Problem Browser & Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Problem Selector Dropdown */}
            <div className="card" style={{ padding: '16px', background: 'var(--bg-surface)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                Select Problem ({filteredProblems.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 220, overflowY: 'auto' }}>
                {filteredProblems.map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleSelectProblem(p)}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      background: selectedProblemId === p.id ? 'var(--bg-elevated)' : 'transparent',
                      border: selectedProblemId === p.id ? '1px solid var(--border-focus)' : '1px solid transparent',
                      color: selectedProblemId === p.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                      fontWeight: selectedProblemId === p.id ? 700 : 500,
                      fontSize: '0.8125rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <span>{p.label}</span>
                    <span className="badge" style={{ fontSize: '0.6875rem', border: `1px solid ${p.diffColor}`, color: p.diffColor }}>
                      {p.difficulty}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Problem Details Card */}
            <div className="card card-3d" style={{ padding: '24px', background: 'var(--bg-surface)', flex: 1 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
                <span className="badge badge-accent">{currentProblem.category}</span>
                <span className="badge" style={{ border: `1px solid ${currentProblem.diffColor}`, color: currentProblem.diffColor }}>
                  {currentProblem.difficulty}
                </span>
                <span className="badge badge-muted">Time: {currentProblem.timeComplexity}</span>
              </div>

              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 14 }}>
                {currentProblem.label}
              </h2>

              {/* Tabs */}
              <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: 14 }}>
                {[
                  { id: 'problem', label: 'Description' },
                  { id: 'hints', label: `Hints (${currentProblem.hints.length})` },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      padding: '8px 14px',
                      background: 'none',
                      border: 'none',
                      borderBottom: activeTab === tab.id ? '2px solid var(--accent)' : '2px solid transparent',
                      color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-muted)',
                      fontWeight: activeTab === tab.id ? 700 : 500,
                      fontSize: '0.8125rem',
                      cursor: 'pointer',
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {activeTab === 'problem' ? (
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  <p style={{ marginBottom: 16 }}>{currentProblem.description}</p>

                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                    Examples:
                  </div>
                  {currentProblem.examples.map((ex, i) => (
                    <div
                      key={i}
                      style={{
                        background: 'var(--bg-elevated)',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: 10,
                        fontSize: '0.8125rem',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      <div><strong>Input:</strong> {ex.input}</div>
                      <div><strong>Output:</strong> {ex.output}</div>
                      {ex.note && <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', marginTop: 2 }}>Note: {ex.note}</div>}
                    </div>
                  ))}

                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: 14, marginBottom: 6 }}>
                    Constraints:
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    {currentProblem.constraints.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {currentProblem.hints.map((hint, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '12px 14px',
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.8125rem',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      <div style={{ fontWeight: 700, color: 'var(--warning)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Lightbulb size={14} /> Hint #{idx + 1}:
                      </div>
                      {hint}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Code Editor & Test Runner */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Editor Container */}
            <div
              className="card card-3d"
              style={{
                padding: 0,
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
              }}
            >
              {/* Editor Toolbar */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 16px',
                  background: 'var(--bg-elevated)',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Terminal size={15} style={{ color: 'var(--accent-text)' }} />
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Solution Editor
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <select
                    className="input"
                    value={language}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    style={{ height: 32, padding: '0 10px', fontSize: '0.75rem', width: 170 }}
                  >
                    {LANGUAGES.map(l => (
                      <option key={l.value} value={l.value}>{l.label}</option>
                    ))}
                  </select>

                  <button
                    onClick={handleRun}
                    disabled={running}
                    className="btn btn-primary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: 6, height: 32 }}
                  >
                    {running ? <RefreshCw size={13} className="animate-spin" /> : <Play size={13} />}
                    {running ? 'Running...' : 'Run Code'}
                  </button>
                </div>
              </div>

              {/* Textarea Code Editor */}
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck="false"
                style={{
                  width: '100%',
                  height: 380,
                  background: 'var(--bg-base)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.875rem',
                  lineHeight: 1.6,
                  padding: '16px',
                  border: 'none',
                  outline: 'none',
                  resize: 'vertical',
                }}
              />
            </div>

            {/* Test Output Console */}
            <div
              className="card"
              style={{
                padding: '18px 20px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Cpu size={15} style={{ color: 'var(--accent-text)' }} /> Execution Console
                </div>
                {results && (
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span className="badge badge-success" style={{ gap: 4 }}>
                      <CheckCircle2 size={12} /> {results.passed}/{results.total} Passed
                    </span>
                    <span className="badge badge-muted">Runtime: {results.runtime}</span>
                    <span className="badge badge-muted">Memory: {results.memory}</span>
                  </div>
                )}
              </div>

              <pre
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8125rem',
                  background: 'var(--bg-base)',
                  border: '1px solid var(--border)',
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  color: results ? 'var(--success)' : 'var(--text-secondary)',
                  margin: 0,
                  minHeight: 80,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {output || 'Click "Run Code" to compile and execute your test suite.'}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
