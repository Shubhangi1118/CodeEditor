#include<iostream>
using namespace std;
int* solution(int a, int arr[]) {
  // Your code here
  int ans[a];
  for(int i=0;i<a;i++)
  {
      ans[i]=2*arr[i];
  }
  retrun ans;
}

int main() {
int n;
cin>>n;
int arr[n];
for(int i=0;i<n;i++)
{
cin>>arr[i];
}
  int* ans = solution(a,arr);
for(int i=0;i<ans.size();i++)
{
cout<<ans[i]<<" ";
}
  return 0;
}