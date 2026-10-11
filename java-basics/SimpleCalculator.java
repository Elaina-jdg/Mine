import java.util.Scanner;
    public class SimpleCalculator{
        public static void main(String[] args) {
            Scanner sc = new Scanner(System.in);
            System.out.println("Enter two numbers:");
            int x = sc.nextInt();
            int y = sc.nextInt();
            System.out.println("Enter an operator (+, -, *, /):");
         String operator = sc.next();
         int result = switch(operator){
                case "+" -> {yield x + y;}
                case "-" -> {yield x - y;}
                case "*" -> {yield x * y;} 
                case "/" -> {yield x / y;}
                default -> {yield 0;}
            };
            System.out.println("Result is " + result);
            }
         }
