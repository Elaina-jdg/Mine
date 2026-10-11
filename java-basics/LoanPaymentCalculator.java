import java.util.Scanner;
    public class LoanPaymentCalculator{
        public static void main(String[] args) {
        Scanner input = new Scanner(System.in);
            System.out.println("Enter annual interst rate");
        double annuallInterestRate = input.nextDouble();
            double monthiyInterestRate = annuallInterestRate / 1200;
       System.out.println("Enter numbers of this year as an integer");
        int numberOfYears =input.nextInt();
            System.out.println("Enter the loanamount");
double loanAmount = input.nextDouble();
    double monthlyPayment = loanAmount * monthiyInterestRate / (1 - 1/Math.pow(1 + monthiyInterestRate , numberOfYears * 12));
    double totalPayment = monthlyPayment * numberOfYears * 12;
        System.out.println("The monthly payment is %" + (int)(monthlyPayment * 100) / 100.0);
        System.out.println("The total payment is $" + (int)(totalPayment * 100) / 100.0);
        }
    }