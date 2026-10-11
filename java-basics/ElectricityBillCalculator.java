import java.util.Scanner;
public class ElectricityBillCalculator {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println("Enter your usage");
        double usage = sc.nextDouble();
        if (usage < 0) {
            System.out.println("Usage is wrong");
            return;
        }

        double cost;
        if (usage >= 200) {
            cost = (usage - 200) * 0.9 + 100 * 0.8 + 100 * 0.5;
        } else if (usage >= 100) {
            cost = (usage - 100) * 0.8 + 100 * 0.5;
        } else {
            cost = usage * 0.5;
        }

        System.out.println("Your cost is " + cost);
    }
}