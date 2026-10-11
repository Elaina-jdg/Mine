import java.util.Scanner;
    public class NumberGuessingGame{
        public static void main(String[] args) {
            Scanner sc = new Scanner(System.in);
        System.out.println("Please enter a number");
        int i = (int)(Math.random() * 100) + 1;
        boolean isRunning = true;
        while(isRunning){
            int num = sc.nextInt();
            if(num > i)
            System.out.println("bigger");
            else if(num < i)
            System.out.println("smaller");
            else {
            System.out.println("Nice");
            isRunning = false;
            }
        }
        }
    }