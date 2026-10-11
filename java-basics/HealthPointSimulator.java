import java.util.Scanner;
public class HealthPointSimulator {
    public static void main(String[] args){
        Scanner sc = new Scanner(System.in);
        int hp = 200;
        System.out.println("Enter a hurt number");
        int hurt = sc.nextInt();  
        while(true){
            
        if(hurt > 0){
        break;}
        else{
             System.out.println("Again");
        }
        }
        hp = hp - hurt;
        if(hp <= 0){
            hp = 1;}
            System.out.println("HP is now " + hp);
        System.out.println("Enter a heal number");
         int heal = sc.nextInt();
        while(true){
        if(heal > 0){
        break;}
        else{
            System.out.println("Again");
        }
        }
        hp = hp + heal;
        if(hp > 200){
            hp = 200;}
            System.out.println("HP is now " + hp);
        
    }
}