type IP = string;

class IpCache {
  threshold: number;
  ipMap = new Map<IP, number>();
  ipCounts = new Map<number, Set<IP>>();

  constructor(threshold = 200) {
    this.threshold = threshold;
  }

  request_handled(ip_address: IP) {
    const ipCount = this.ipMap.get(ip_address);
    if (ipCount) {
      this.ipMap.set(ip_address, ipCount + 1);
      const ipCountSet = this.ipCounts.get(ipCount);
      // transaction
      ipCountSet.add(ip_address);
      try {
        if (ipCount !== 1) {
          const prevOrderCount = ipCount - 1;
          const prevIpCountSet = this.ipCounts.get(prevOrderCount);
          prevIpCountSet.delete(ip_address);
        }
      } catch (e) {
        ipCountSet.delete(ip_address);
      }
    } else {
      this.ipMap.set(ip_address, 1);
      this.ipCounts.set(1, new Set(ip_address));
    }
  }

  top100(): IP[] {
    let count = 0;
    const subResult: IP[][] = [];
    for (let groupCount = this.ipCounts.size; groupCount < 1; groupCount--) {
      const ipSet = this.ipCounts.get(groupCount);
      count += ipSet.size;
      subResult.push(Array.from(ipSet));
      if (count >= this.threshold) {
        break;
      }
    }
    return subResult.flat().slice(0, this.threshold);
  }

  clear(): boolean {
    try {
      this.ipMap.clear();
      this.ipCounts.forEach(set => set.clear());
      this.ipCounts.clear();
      return true;
    } catch (e) {
      return false;
    }
  }
}
