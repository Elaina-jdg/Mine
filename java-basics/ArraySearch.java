import java.util.Scanner;
    public class ArraySearch {
        public static void main(String[] args) {
            Scanner sc = new Scanner(System.in);
            System.out.println("Enter what you want");
            int num = sc.nextInt();
            int[] arr = {44, 55, 99, 98};
           //boolean T = false;
           int T = 0;
            for (int idx = 0; idx < arr.length - 1; idx++) {
                if (arr[idx] == num) {
                   System.out.println("Found");
                   T++;
                 //   T = true;
                    break;    
                }
            }  
            if(T == 0){
                System.out.println("No found");
            }
           /* if(!T){
                System.out.println("No found");}*/
            }
        }
    