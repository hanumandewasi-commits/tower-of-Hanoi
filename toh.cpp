#include<iostream>
#include <cmath>
using namespace std;
void towerOfHanoi(int n, char from_end,char to_end, char aux_end)
{
    if(n==1){
        cout<<"move from "<<from_end<<" to "<<to_end<<endl;
    }
    else{
        towerOfHanoi(n-1,from_end,aux_end,to_end);
        cout<<"move from "<<from_end<<" to "<<to_end<<endl;
        towerOfHanoi(n-1,aux_end,to_end,from_end);

    }
}
int main()
{
    int n;
    cout<<"Enter the number of Disks:"<<endl;
    cin>>n;
    cout<<"number of movements is: "<<pow(2,n)-1<<endl;
    towerOfHanoi(n,'A','C','B');
    return 0;
}