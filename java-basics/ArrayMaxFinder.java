

public class ArrayMaxFinder{
    public static void main(String[] args) {
        int[] arr = {10, 29, 98, 27, 47};
        int max = arr[0];
        for (int idx = 0; idx < arr.length; idx++) {
        if(max < arr[idx]){
            max = arr[idx];
        }    
        }
        System.out.println(max);
    

    }
}