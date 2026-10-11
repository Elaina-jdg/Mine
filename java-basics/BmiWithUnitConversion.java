import java.util.Scanner;
    public class BmiWithUnitConversion{
        public static void main(String[] args) {
            Scanner sc = new Scanner(System.in);
             System.out.println("Enter your weight:");
               double weight = sc.nextDouble();
     System.out.println("Enter your height:");
               double height = sc.nextDouble();
               final double kg = 0.45359237;
               final double m = 0.024;
               double W = weight * kg;
               double H = height * m;
        double BMI = W / (H * H);
        System.out.println("BIM is" + BMI);
        if(BMI < 18.5)System.out.println("UW");
        else if (BMI < 25)
         System.out.println("NO");
        else if (BMI < 30)
         System.out.println("OW");
         else 
         System.out.println("O");
        }
    }