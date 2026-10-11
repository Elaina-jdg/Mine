import java.util.Scanner;

public class DistanceBetweenTwoPoints {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);
        System.out.println("Enter the first dot");
        double dot_v1 = input.nextDouble();
        double dot_v2 = input.nextDouble();
        point(input, dot_v1, dot_v2);
    }

    public static void point(Scanner input, double dot_v1, double dot_v2) {
        System.out.println("Enter the second dot");
        double dot_v3 = input.nextDouble();
        double dot_v4 = input.nextDouble();
        System.out.println("The first dot is: (" + dot_v1 + ", " + dot_v2 + ")");
        System.out.println("The second dot is: (" + dot_v3 + ", " + dot_v4 + ")");
        double R = Math.pow(dot_v3 - dot_v1, 2);
        double T = Math.pow(dot_v4 - dot_v2, 2);
        double Y = R + T;
        System.out.println(Math.pow(Y, 0.5));
    }
}