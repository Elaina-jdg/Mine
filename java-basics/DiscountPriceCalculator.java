import java.util.Scanner;
public class DiscountPriceCalculator {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println("Enter a price");
        double price = sc.nextDouble();
        double disprice = price;

        if (price >= 200)
            disprice = price - 90;
        else if (price >= 100)
            disprice = price - 50;
        else if (price >= 50)
            disprice = price - 30;
        else if (price >= 10)
            disprice = price - 8;
        else{
            System.out.println("Price is wrong");
        }    

        double vip = price * 0.8;

        if (vip < disprice)
            System.out.println(vip);
        else
            System.out.println(disprice);
    }
}
