package com.xiaolu.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class Util {
	//jdbc:mysql://这里写上你服务器的 IP 地址和端口号/数据库名?useUnicode=true&characterEncoding=UTF-8
	private static final String URL = "";
	private static final String DRIVER = "com.mysql.jdbc.Driver";
	private static final String USER = "";// 数据库用户名
	private static final String PASS = "";// 数据库密码
	private static Connection conn = null;

	public static Connection getConnection() {
		try {
			if (conn == null || conn.isClosed()) {
				Class.forName(DRIVER);
				conn = DriverManager.getConnection(URL, USER, PASS);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		}
		return conn;
	}
}
