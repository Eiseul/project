import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Scanner;

public class Book {
    String title;
    String book_writer;
    int pages;
    int price;
    String book_date;

    // 생성자
    public Book(String title, String author, int pages, int price, String pub_Date) {
        this.title = title;
        this.book_writer = author;
        this.pages = pages;
        this.price = price;
        this.book_date = pub_Date;
    }

    // READ
    public static void readBook(Scanner sc){
        System.out.print("제목을 입력하세요 >> ");
        String keyword = sc.nextLine();

        ArrayList<Book> result = DBconnection(keyword);

        if (result.isEmpty()) {
            System.out.println("검색 결과가 없습니다.");
        } else {
            System.out.println("\n 검색 결과 ----------------------\n");
            for (Book b : result) {
                b.printInfo();
            }
        }
    }

    // CREATE
    public static void createBook(Scanner sc){
        System.out.print("제목 : ");
        String title = sc.nextLine();

        System.out.print("저자 : ");
        String author = sc.nextLine();

        System.out.print("페이지 수 : ");
        int pages = sc.nextInt();

        System.out.print("가격 : ");
        int price = sc.nextInt();
        sc.nextLine();

        System.out.print("출간일 (예: 2021.05.12) >> ");
        String pubDate = sc.nextLine();


        String driver = "oracle.jdbc.driver.OracleDriver";
        String url = "jdbc:oracle:thin:@localhost:1521:xe";
        String userid = "bituser";
        String passwd = "bituser";

        String sql = "INSERT INTO gilbut_books (title, author, pages, price, pub_date) VALUES (?, ?, ?, ?, ?)";

        try {
            Class.forName(driver);
            Connection conn = DriverManager.getConnection(url, userid, passwd);
            PreparedStatement psm = conn.prepareStatement(sql);

            // SQL문에 값 넣기
            psm.setString(1, title);
            psm.setString(2, author);
            psm.setInt(3, pages);
            psm.setInt(4, price);
            psm.setString(5, pubDate);

            int result = psm.executeUpdate(); // 실행 결과 확인

            if(result > 0) {
                System.out.println("도서 추가 완료!");
            } else {
                System.out.println("도서 추가 실패!");
            }
            conn.close();
        } catch (ClassNotFoundException | SQLException e) {
            e.printStackTrace();
        }
}

    // UPDATE
   public static void updateBook(Scanner sc) {
    System.out.print("수정할 도서 제목 >> ");
    String title = sc.nextLine();

    // 1. 검색해서 도서 존재 여부 확인
    ArrayList<Book> result = DBconnection(title);
    if (result.isEmpty()) {
        System.out.println("해당 제목의 도서가 없습니다.");
        return;
    }

    // 2. 새 정보 입력
    System.out.print("새 페이지 수 >> ");
    int pages = sc.nextInt();
    sc.nextLine(); // 개행 제거

    System.out.print("새 가격 >> ");
    int price = sc.nextInt();
    sc.nextLine(); // 개행 제거

    System.out.print("새 출간일 (예: 2024.01.01) >> ");
    String pubDate = sc.nextLine();

    // 3. DB에 업데이트 실행
    String driver = "oracle.jdbc.driver.OracleDriver";
    String url = "jdbc:oracle:thin:@localhost:1521:xe";
    String userid = "bituser";
    String passwd = "bituser";
    String sql = "UPDATE gilbut_books SET pages = ?, price = ?, pub_date = ? WHERE title = ?";

    try {
        Class.forName(driver);
        Connection conn = DriverManager.getConnection(url, userid, passwd);
        PreparedStatement psm = conn.prepareStatement(sql);

        psm.setInt(1, pages);
        psm.setInt(2, price);
        psm.setString(3, pubDate);
        psm.setString(4, title);

        int updated = psm.executeUpdate();

        if (updated > 0) {
            System.out.println("도서 정보가 수정되었습니다.");
        } else {
            System.out.println("수정 실패: 일치하는 도서를 찾지 못했습니다.");
        }

        conn.close();
    } catch (ClassNotFoundException | SQLException e) {
        e.printStackTrace();
    }
}


    // DELETE
    public static void deleteBook(Scanner sc){
        System.out.print("삭제할 도서명을 입력하세요 >> ");
        String title = sc.nextLine();

        // 책이 실제로 존재하는 지 확인
        ArrayList<Book> result = DBconnection(title);
        if (result.isEmpty()) {
            System.out.print("해당 제목의 도서가 없습니다.");
            return;
        }

        // 삭제 확인
        System.out.print("정말 삭제하시겠습니까? (Y/N) >> ");
        String confirm = sc.nextLine();
        if (!confirm.equalsIgnoreCase("Y")) {
            System.out.println("삭제를 취소했습니다.");
            return;
        }
        String driver = "oracle.jdbc.driver.OracleDriver";
        String url = "jdbc:oracle:thin:@localhost:1521:xe";
        String userid = "bituser";
        String passwd = "bituser";
        String sql = "DELETE FROM gilbut_books WHERE title = ?";

        try {
            Class.forName(driver);
            Connection conn = DriverManager.getConnection(url, userid, passwd);
            PreparedStatement psm = conn.prepareStatement(sql);

            psm.setString(1, title);

            int deleted = psm.executeUpdate();

            if (deleted > 0) {
                System.out.println("도서가 삭제되었습니다.");
            } else {
                System.out.println("삭제 실패: 일치하는 도서를 찾지 못했습니다.");
            }

            conn.close();
        } catch (ClassNotFoundException | SQLException e) {
            e.printStackTrace();
    }
}

    // 책 정보 출력
    public void printInfo() {
        System.out.println("제목: " + title);
        System.out.println("저자: " + book_writer);
        System.out.println("페이지: " + pages + "쪽");
        System.out.println("가격: " + price + "원");
        System.out.println("출간일: " + book_date);
        System.out.println("---------------");
    }

    // DB 연결 및 검색
    public static ArrayList<Book> DBconnection(String title) {
        String driver = "oracle.jdbc.driver.OracleDriver";
        String url = "jdbc:oracle:thin:@localhost:1521:xe";
        String userid = "bituser";
        String passwd = "bituser";
        String sql = "SELECT title, author, pages, price, pub_date FROM gilbut_books WHERE title LIKE ?";    

        PreparedStatement psm = null;
                Connection conn = null; 
                ResultSet rs = null; 
        
        ArrayList<Book> bookList = new ArrayList<>();
        try {
            Class.forName(driver);
            conn = DriverManager.getConnection(url, userid, passwd);
            System.out.println("오라클 DB 연결 성공");

            psm = conn.prepareStatement(sql); ///prepareStatement 를 통해 sql문 할당
            psm.setString(1, "%" + title + "%");
                        rs = psm.executeQuery(); //실행

            while(rs.next()) {
                String t = rs.getString("title");
                String a = rs.getString("author");
                int p = rs.getInt("pages");
                int pr = rs.getInt("price");
                String d = rs.getString("pub_date");

                Book b = new Book(t, a, p, pr, d);
                bookList.add(b);
            } 

        conn.close();
        } catch (ClassNotFoundException | SQLException e) {
            e.printStackTrace();
        }
        return bookList;
    }

    // 메인 실행
    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);
        

        while(true){
            System.out.println("1. 도서 조회");
            System.out.println("2. 도서 추가");
            System.out.println("3. 도서 수정");
            System.out.println("4. 도서 삭제");
            System.out.println("5. 종료");
            System.out.print("번호 선택 >> ");

            int menu = sc.nextInt();
            sc.nextLine(); // 개행 제거

            switch(menu) {
                case 1:
                    readBook(sc);
                    break;
                case 2:
                    createBook(sc);
                    break;
                case 3:
                    updateBook(sc);
                    break;
                case 4:
                    deleteBook(sc);
                    break;
                case 5:
                    System.out.println("종료되었습니다");
                    isRun = false;   // 루프 종료 신호
                    break;
                default:
                    System.out.println("올바른 번호를 선택하세요.");
            }
        }
        sc.close();
    }
}
