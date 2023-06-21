#include <iostream>
#include <vector>
using namespace std;

void solution(int a, int arr[], vector<int>& ans) {
  ans.resize(a);
  for (int i = 0; i < a; i++) {
    ans[i] = 2 * arr[i];
  }
}

int main() {
  int n;
  cin >> n;
  int arr[n];
  for (int i = 0; i < n; i++) {
    cin >> arr[i];
  }
  vector<int> ans;
  solution(n, arr, ans);
  for (int i = 0; i < ans.size(); i++) {
    cout << ans[i] << " ";
  }
  return 0;
}
