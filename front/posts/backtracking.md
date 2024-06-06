---
title: backtracking 解题模板
tags: ['backtracking', 'algorithm']
ctime: 2024-5-31 18:42
mtime: 2024-5-31 18:42
---



回溯算法题解模板

<!-- more -->

## 排列

给定一组数，得到所有的排列方案

```rust
fn solve_permutation(list: Vec<i32>) {
    let mut flags = vec![false; list.len()];
    let mut cur_list = vec![];
    let mut solutions = vec![];
    solve(&mut cur_list, &list, &mut flags, &mut solutions);
}

fn solve(
    cur_list: &mut Vec<i32>,
    list: &Vec<i32>,
    flags: &mut Vec<bool>,
    solutions: &mut Vec<Vec<i32>>,
) {
    if cur_list.len() > 0 {
        solutions.push(cur_list.clone());
    }
    for idx in 0..flags.len() {
        let flag = flags[idx];
        if !flag {
            flags[idx] = true;
            cur_list.push(list[idx]);
            solve(cur_list, list, flags, solutions);
            cur_list.pop();
            flags[idx] = false;
        }
    }
}
```

示例：

对1,3,5进行排列，共计15总方案

```
[[1], [1, 3], [1, 3, 5], [1, 5], [1, 5, 3], [3], [3, 1], [3, 1, 5], [3, 5], [3, 5, 1], [5], [5, 1], [5, 1, 3], [5, 
3], [5, 3, 1]]
```

## 组合

组合只需要保证不回头即可, 加一个start_idx变量，查询时，搜索start_idx..flags.len()即可

```rust
fn solve(
    cur_list: &mut Vec<i32>,
    numbers: &mut Vec<i32>,
    flags: &mut Vec<bool>,
    start_idx: usize,
    total: &mut i32,
) {
    let mut cur = 0;
    for item in cur_list.iter() {
        cur ^= *item;
    }
    *total += cur;
    for idx in start_idx..flags.len() {
        let flag = flags[idx];
        if !flag {
            cur_list.push(numbers[idx]);
            flags[idx] = true;
            solve(cur_list, numbers, flags, idx + 1, total);
            cur_list.pop();
            flags[idx] = false;
        }
    }
}

impl Solution {
    pub fn subset_xor_sum(nums: Vec<i32>) -> i32 {
        let mut total = 0;
        let mut cur_list = vec![];
        let mut nums = nums;
        let mut flags = vec![false; nums.len()];
        solve(&mut cur_list, &mut nums, &mut flags, 0, &mut total);
        total
    }
}
```

