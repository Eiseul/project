import java.sql.*;
import java.text.ParseException;
import java.text.SimpleDateFormat;
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

    // 책 정보 출력
    public void printInfo() {
        System.out.println("제목: " + title);
        System.out.println("저자: " + book_writer);
        System.out.println("페이지: " + pages + "쪽");
        System.out.println("가격: " + price + "원");
        System.out.println("출간일: " + book_date);
        System.out.println("---------------");
    }

    // READ
    public static void readBook(Scanner sc) {
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
    public static void createBook(Scanner sc) {
        System.out.print("제목 : ");
        String title = sc.nextLine();

        System.out.print("저자 : ");
        String author = sc.nextLine();

        System.out.print("페이지 수 : ");
        int pages = sc.nextInt();

        System.out.print("가격 : ");
        int price = sc.nextInt();
        sc.nextLine();

        String pubDate = "";
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy.MM.dd");
        sdf.setLenient(false);

        while (true) {
            System.out.print("출간일을 예시와 같이 입력해주십시오 (예: 2021.05.12) >> ");
            pubDate = sc.nextLine();

            if (pubDate.equals("0")) {
                System.out.println("도서 추가를 취소합니다.");
                return;
            }

            try {
                sdf.parse(pubDate);
                break;
            } catch (ParseException e) {
                System.out.println("날짜 형식이 잘못되었습니다.");
            }
        }

        String sql = "INSERT INTO gilbut_books (title, author, pages, price, pub_date) VALUES (?, ?, ?, ?, ?)";

        try (Connection conn = getConnection();
             PreparedStatement psm = conn.prepareStatement(sql)) {

            psm.setString(1, title);
            psm.setString(2, author);
            psm.setInt(3, pages);
            psm.setInt(4, price);
            psm.setString(5, pubDate);

            int result = psm.executeUpdate();

            System.out.println(result > 0 ? "도서 추가 완료!" : "도서 추가 실패!");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // UPDATE
    public static void updateBook(Scanner sc) {
        System.out.print("수정할 도서 제목 >> ");
        String title = sc.nextLine();

        // 검색해서 도서 존재 여부 확인
        ArrayList<Book> result = searchBookByExactTitle(title);
        if (result.isEmpty()) {
            System.out.println("해당 제목의 도서가 없습니다.");
            return;
        }

        // 새 정보 입력
        System.out.print("새 페이지 수 >> ");
        int pages = sc.nextInt();
        sc.nextLine();

        System.out.print("새 가격 >> ");
        int price = sc.nextInt();
        sc.nextLine();

        System.out.print("새 출간일 (예: 2024.01.01) >> ");
        String pubDate = sc.nextLine();

        String sql = "UPDATE gilbut_books SET pages = ?, price = ?, pub_date = ? WHERE title = ?";

        // 데이터베이스에 연동
        try (Connection conn = getConnection();
             PreparedStatement psm = conn.prepareStatement(sql)) {

            psm.setInt(1, pages);
            psm.setInt(2, price);
            psm.setString(3, pubDate);
            psm.setString(4, title);

            int updated = psm.executeUpdate();
            System.out.println(updated > 0 ? "도서 정보가 수정되었습니다." : "수정 실패: 일치하는 도서를 찾지 못했습니다.");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // DELETE
    public static void deleteBook(Scanner sc) {
        System.out.print("삭제할 도서명을 입력하세요 >> ");
        String title = sc.nextLine();

        // 책이 실제로 존재하는 지 확인
        ArrayList<Book> result = searchBookByExactTitle(title);
        if (result.isEmpty()) {
            System.out.println("해당 제목의 도서가 없습니다.");
            return;
        }

        // 삭제 확인
        System.out.print("정말 삭제하시겠습니까? (Y/N) >> ");
        String confirm = sc.nextLine();
        if (!confirm.equalsIgnoreCase("Y")) {
            System.out.println("삭제를 취소했습니다.");
            return;
        }

        String sql = "DELETE FROM gilbut_books WHERE title = ?";

        // 데이터베이스 연동
        try (Connection conn = getConnection();
             PreparedStatement psm = conn.prepareStatement(sql)) {

            psm.setString(1, title);
            int deleted = psm.executeUpdate();
            System.out.println(deleted > 0 ? "도서가 삭제되었습니다." : "삭제 실패: 일치하는 도서를 찾지 못했습니다.");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // DB 연결 함수
    public static Connection getConnection() throws Exception {
        String driver = "oracle.jdbc.OracleDriver";
        String url = "jdbc:oracle:thin:@localhost:1521:xe";
        String userid = "bituser";
        String passwd = "bituser";

        Class.forName(driver);
        return DriverManager.getConnection(url, userid, passwd);
    }

    // 도서 조회시 사용할 검색 함수 (LIKE 검색)
    public static ArrayList<Book> DBconnection(String title) {
        String sql = "SELECT title, author, pages, price, pub_date FROM gilbut_books WHERE title LIKE ?";
        ArrayList<Book> bookList = new ArrayList<>();

        try (Connection conn = getConnection();
             PreparedStatement psm = conn.prepareStatement(sql)) {

            psm.setString(1, "%" + title + "%");
            ResultSet rs = psm.executeQuery();

            while (rs.next()) {
                Book b = new Book(
                        rs.getString("title"),
                        rs.getString("author"),
                        rs.getInt("pages"),
                        rs.getInt("price"),
                        rs.getString("pub_date")
                );
                bookList.add(b);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return bookList;
    }

    // 도서 수정시 사용할 검색 함수 (정확히 일치)
    public static ArrayList<Book> searchBookByExactTitle(String title) {
        String sql = "SELECT title, author, pages, price, pub_date FROM gilbut_books WHERE title = ?";
        ArrayList<Book> bookList = new ArrayList<>();

        try (Connection conn = getConnection();
             PreparedStatement psm = conn.prepareStatement(sql)) {

            psm.setString(1, title);
            ResultSet rs = psm.executeQuery();

            while (rs.next()) {
                Book b = new Book(
                        rs.getString("title"),
                        rs.getString("author"),
                        rs.getInt("pages"),
                        rs.getInt("price"),
                        rs.getString("pub_date")
                );
                bookList.add(b);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return bookList;
    }

    // 메인 실행
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        boolean isRun = true;

        while (isRun) {
            System.out.println("\n--- 도서 관리 시스템 ---");
            System.out.println("1. 도서 조회");
            System.out.println("2. 도서 추가");
            System.out.println("3. 도서 수정");
            System.out.println("4. 도서 삭제");
            System.out.println("5. 종료");
            System.out.print("번호 선택 >> ");

            int menu = sc.nextInt();
            sc.nextLine();

            switch (menu) {
                case 1:
                    while (true) {
                        System.out.println("\n[도서 조회]");
                        System.out.println("1. 전체 도서 목록");
                        System.out.println("2. 도서 검색");
                        System.out.println("0. 메인 메뉴로 돌아가기");
                        System.out.print("선택 >> ");
                        int subMenu = sc.nextInt();
                        sc.nextLine();

                        if (subMenu == 0) break;

                        switch (subMenu) {
                            case 1:
                                ArrayList<Book> allBooks = DBconnection("");
                                if (allBooks.isEmpty()) {
                                    System.out.println("등록된 도서가 없습니다.");
                                } else {
                                    for (Book b : allBooks) {
                                        b.printInfo();
                                    }
                                }
                                break;
                            case 2:
                                readBook(sc);
                                break;
                            default:
                                System.out.println("올바른 번호를 선택하세요.");
                        }
                    }
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
                    System.out.println("종료되었습니다.");
                    isRun = false;
                    break;
                default:
                    System.out.println("올바른 번호를 선택하세요.");
                    break;
            }
        }
        sc.close();
    }
}
