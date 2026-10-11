public class NumberFilterByFour{
    public static void main(String[] args) {
        for (int i = 0; i <= 100000; i++) {
            if (i % 10 == 4 || i / 10 % 10 == 4 ) {
                System.out.println("yes");
                continue;
            }
            else if (i % 4 == 0) {
                System.out.println("YES");
                continue;
            }
           System.out.println(i);
        }
    }
}