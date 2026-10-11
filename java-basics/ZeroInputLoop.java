import java.util.Scanner;
    public class ZeroInputLoop{
        public static void main(String[] args) {
            Scanner sc = new Scanner(System.in);
            System.out.println("Enter");
             
            
            while(true){
            int a = sc.nextInt();   
                if(a == 0){
            }
                else{
                    System.out.println("again");
                }
               
            }
        }
    }

    