import java.util.Scanner;
  public class DigitSumCalculator{
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println("Please enter a number");
        int num = sc.nextInt();
        int sum = 0;
        if(num <= 0){
          num = -num;
        }
        while(num != 0){
        System.out.println(num % 10);
        sum = sum + num % 10;
        num = num / 10;

    }
    System.out.println(sum);
  }
  }