import java.util.Scanner;
public class WeekdayActivitySwitch{
    public static void main(String[] args){
        Scanner sc = new Scanner(System.in);
        System.out.println("Enter today's date:");
        int week = sc.nextInt();
        switch(week){
            case 1:
                System.out.println("Running");
                break;
            case 2:
                System.out.println("Swimming");
                break;
            case 3:
                System.out.println("Cycling");
                break;
            case 4:
                System.out.println("Walking"); 
                break;
            case 5:
                System.out.println("Hiking");
                break;
            case 6:
                System.out.println("Resting");      
                break;
            case 7:     
                System.out.println("Resting");
                break;      
             default:
                System.out.println("No such day");
                break;    
            
        }
    
    }
}