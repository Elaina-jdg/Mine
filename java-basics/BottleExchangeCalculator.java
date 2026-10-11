/*import java.util.Scanner;
    public class BottleExchangeCalculator{
        public static void main(String[] args) {
            Scanner sc = new Scanner(System.in);
            System.out.println("Enter your  bottle");
            int bottle = sc.nextInt();
            int NewBottle = 0;
            while(bottle >= 3){
        NewBottle = bottle % 3 + bottle / 3;
        bottle++;
            }
            System.out.println(NewBottle);
        }
    }*/
   import java.util.Scanner;

public class BottleExchangeCalculator {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println("Enter your bottle");
        int bottle = sc.nextInt();
        int NewBottle = 0; 

        while (bottle >= 3) {
            NewBottle += bottle / 3;
            bottle = bottle % 3 + bottle / 3;
        }
        if (bottle == 2) {
            NewBottle++;
        }
        System.out.println(NewBottle);
    }
}