import java.util.Scanner;

public class AlternatingSumCalculator {
    public static void main(String[] args) {
        try (Scanner scanner = new Scanner(System.in)) {
            System.out.print("Enter a number: ");
            int num1 = scanner.nextInt();
            int sum = 0;

            for (int i = 1; i <= num1; i++) {
                if (i % 2 == 1) {
                    sum += i;
                } else {
                    sum -= i;
                }
            }

            System.out.println(sum);
        }
    }
}
