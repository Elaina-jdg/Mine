import java.util.Scanner;
public class DiscountPriceCalculatorV2 {
    public static void main(String[] args){
        Scanner sc = new Scanner(System.in);
        System.out.println("Enter a number");
        double price = sc.nextDouble();
        double discount = price;
    if(price >= 200 )
            discount = 90;
        else if(price >= 100 && price < 200)
            discount = 50;
        else if(price >= 50&& price < 100)
            discount = 30;
        else if(price >= 10&& price < 50)
            discount = 8;
        else{
            System.out.println("Price is wrong");
        }    
       double disprice = price - discount;
       double mamberprice = price * 0.8;
       System.out.println(Math.min(disprice, mamberprice));
    }
}