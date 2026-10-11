import java.util.Scanner;
    public class PrimeNumberChecker{
    public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    System.out.println("Entet a number bigger than 2");
    int num = 0;
    while(true){
    num = sc.nextInt();
    if(num > 2){
    break;
}
    else{
    System.out.println("Again enter");
}
}
    int count =0;
    for (int i = 2; i < num; i++) {
    if(num % i == 0){
        count++;
    }
 }
    if(count == 0){
    System.out.println("yes");
 }
    else{
    System.out.println("no");
    }
}
}