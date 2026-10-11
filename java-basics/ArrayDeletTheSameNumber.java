

public class ArrayDeletTheSameNumber{
    public static void main(String[] args) {
        int[] arr = new int[10];
       
        for (int idx = 0; idx < arr.length; idx++) {
            int a = (int) (Math.random() * 100) + 1;
            arr[idx] = a;
          int count = 0;
          for (int y = 0; y < arr.length; y++) {
        if(a == arr[idx]){
            count++;
            break;
        }    
          }
          if(count == 0);
          arr[idx] = a;
            }
            for (int i = 0; i < arr.length; i++) {
              System.out.println
              (arr[i]);
                
            }
            System.out.println("");
       

        
        }
    }
