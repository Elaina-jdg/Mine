import java.util.Scanner;
public class ArrayInputOutput {
    public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    System.out.println("Enter three numbers");
    int[] arr = new int[3];
    for (int i = 0; i < arr.length; i++) {
        int num = sc.nextInt();
        arr[i] = num;
    }
  for (int idx = 0; idx < arr.length; idx++) {
      System.out.println(arr[idx]);
      
  }
    }
}