public class PaperFoldingHeight {
    public static void main(String[] args) {
        double paper = 0.1;
        double mountain = 8848860;
        double fold = 0;

        while (paper <= mountain) {
            paper *= 2;
            fold++;
        }

        System.out.println(fold);
    }
}