import java.util.Scanner;
    public class SeasonByMonth{
        public static void main(String[] args) {
            Scanner sc = new Scanner(System.in);
            System.out.println("Enter this month");
            int month = sc.nextInt();
         String season = switch(month){
                case 3,4,5 -> {yield  "Spring";}
                case 6,7,8 -> {yield "Summer";}
                case 9,10,11 -> {yield "Autumn";}
                case 12,1,2 -> {yield "Winter";}
                default -> {yield "Invalid month";}
            };
            System.out.println(season);
            }
         
            
        }
    
              