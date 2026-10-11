import java.util.Scanner;
public class DivisibleByThreeAndFive {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Enter two numbers: ");
        int num1 = scanner.nextInt();
        int num2 = scanner.nextInt();
                 
    int max = (num1 > num2) ? num1 : num2;
    int min = (num1 < num2) ? num1 : num2;
   
   int count = 0;
    for (int i = min; i <= max; i++) {
        if(i % 5 == 0 && i % 3 ==0)
        System.out.println(i);
        count++;
        
    }
    
    if (count == 0) {
        System.out.println("No numbers found that are divisible by both 3 and 5.");
    } else {
        System.out.println("Total numbers found that are divisible by both 3 and 5: " + count);
    }
 }
}
