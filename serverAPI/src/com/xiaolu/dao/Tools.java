package com.xiaolu.dao;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.xiaolu.util.Util;


public class Tools {
	
	//查询
	public static List executeQuary(String sql, Object... objects) {
		List li=new ArrayList();
		ResultSet rs;
		try {
			PreparedStatement ps=Util.getConnection().prepareStatement(sql);
			if (objects != null) {
				for (int i = 0; i < objects.length; i++) {
					ps.setObject(i + 1, objects[i]);
				}
			}
			rs= ps.executeQuery();
			//把resultset内容传到list
			ResultSetMetaData md = rs.getMetaData();//获取键名
			int columnCount = md.getColumnCount();//获取行的数量
			while (rs.next()) {
				Map rowData = new HashMap();//声明Map
				for (int i = 1; i <= columnCount; i++){
					rowData.put(md.getColumnName(i), rs.getObject(i));//获取键名及值ֵ
				}
				li.add(rowData);
			}
			rs.close();
			ps.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}

		return li;
	}
	
	//增删改
	public static int executeUpdate(String sql, Object... objects) {
		int s=0;
		try {
			
			PreparedStatement ps=Util.getConnection().prepareStatement(sql);
			if (objects != null)
				for (int i = 0; i < objects.length; i++) {
					
					ps.setObject(i + 1, objects[i]);
				}

			s= ps.executeUpdate();
			ps.close();
			return s;
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return s;
	}
}