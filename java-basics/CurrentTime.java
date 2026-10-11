public class CurrentTime{
    public static void main(String[] args) {
        long totalM =System.currentTimeMillis();
long totalS = totalM/1000;
long currentSecond = totalS % 60;
long totalMinutes = totalS / 60;
long currentMinute = totalMinutes % 60;
long totalHour = totalMinutes / 60;
long currentHour = totalHour % 24;
 System.out.println("Current time is " + currentHour + ":" + currentMinute + ":" + currentSecond + " GMT");
    }
}