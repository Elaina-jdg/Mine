import java.util.Scanner;
     public class BmiBasicCalculator{
          public static void main(String[] args) {
              Scanner input = new Scanner(System.in);
              System.out.println("Enter your weight:");
               double weight = input.nextDouble();
     System.out.println("Enter your height:");
               double height = input.nextDouble();
     
          double BIM = weight / (height * height);
     System.out.println(BIM);
          }
     }