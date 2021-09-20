# Test Top 200 IPs

What would you do differently if you had more time?

I would think about asynchronous queue with sorting, but it could not ok with consistent (CAP theorem)
I would add tests
I would measure a few more approaches to find faster (e.g. to not delete IPs from Sets when it increments but remove duplicates in the giving top 200 functions)
I would improve the logic of "transactions" with "fallbacks"

What is the runtime complexity of each function?
The maximum complexity is linear

How does your code work?
1. IPs stored in indexed data structures in JS: 'Map's and 'Set's
2. We have 2 Maps:
   a) In 1st Map I store IP as an index and its count as a value which will be incremented on each `request_handled` call
   b) 2nd Map has a count of IPs appearing as key, and a Set of IPs unique strings as value: this logic helps to divide and group by count of occurring
3. When `request_handled` is called the IP is saved into 1st Map and its count is incremented and "move" the IP from a set of previous counts to the next:
   a) if no IP in the 1st Map it's stored with count 1 and stored in a Set in 2nd Map with its count key
   b) if IP exists in 1st Map:
- get its count from 1st Map;
- then update its count in 1st Map;
- then searching the Set in 2nd Map by count index key;
- then store this IP with incremented count in 2nd Map;
- then delete this IP in the Set in 2nd Map by current count index key;
  c) last actions try to do in some kind of transactions

What other approaches did you decide not to pursue?
- async queue for sorting - the data can be inconsistent for the current time (CAP)
- to do not delete IP from the previous Set, but to measure 'result' Set size each time to make sure I got enough (200) IPs with the highest count;

How would you test this?
- I would create auto generator of IP addreses by incremented numbers in the pattern `([0-9]{1,3}\.){3}[0-9]{1,3}`  - with start 10e3 to check logic and end with 20e6 to check speed
- Then I would go in the cycle to call `request_handled` and pass each IP in еру algebraic progression to increase the occurrence of each IP by 1 in each iteration: last element 1 time, first element n times (10e3 and 20e6 for the current examples); I would measure the time of each function call;
-  Then I would just call `top100` and measure its work time; I would check the correctness: just 200 of last IPs;
-  Then I would call `clear` and measure its work time and check the result;
