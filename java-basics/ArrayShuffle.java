

import java.util.Random;

public class ArrayShuffle{
    public static void main(String[] args) {
        int[] arr = {1, 2, 3, 4, 5};
        Random r = new Random();
        for (int i = 0; i < arr.length; i++) {
         int RandomI = r.nextInt(arr.length);
        int temp = arr[i];
        arr[i] = arr[RandomI];
        arr[RandomI] = temp;
        }

         for (int idx = 0; idx < arr.length; idx++) {
       System.out.println(arr[idx]);
             
         }

         
            
        
    }
}