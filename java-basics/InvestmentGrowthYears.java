public class InvestmentGrowthYears {
    public static void main(String[] args) {
        double money = 100000;
        double Emoney = 200000;
        double year = 0;
        while (money <= Emoney) {
            System.out.println(money);
            money = money + money * 0.017;
            year++;
        }
        System.out.println(year);
    }
}