package com.xiaolu.servlet;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.xiaolu.dao.Tools;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

/**
 * 按照不同公众号 id 获取文章列表
 * @author Boy Baby
 *
 */
@WebServlet("/ArticelListServlet")
public class ArticelListServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    public ArticelListServlet() {
        super();
    }
	
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		//解决乱码
		request.setCharacterEncoding("utf-8");
		response.setContentType("text/html;charset=utf-8");
		
		//接受数据
		StringBuffer sbJson = new StringBuffer();
		String line = "";
		try{
			//读取网络传输过来的数据
			BufferedReader br = request.getReader();
			//遍历数据并拼接
			while((line = br.readLine())!= null){
				//如果读到数据,把他添加到字符流中  
				sbJson.append(line);
			}
		}catch (Exception e) {
			e.printStackTrace();
		}
		
		System.out.println("client json data =" + sbJson);  
		
		 // 功能:把读取到的数据封装 JSON
		System.out.println("JSON = "+ sbJson.toString());
		JSONObject jsonobject = JSONObject.fromObject(sbJson.toString());
		String type = jsonobject.getString("type");//操作类型
		String id = jsonobject.getString("id");//公众号id
		
		//文章删除
		if(type.equals("2")){
			String no = jsonobject.getString("no");//操作类型
			String deleteSql = "delete from articel where no = "+no+" and g_id = "+id+"";
			int count = Tools.executeUpdate(deleteSql);
			if(count>0){
				JSONObject jsonObject2 = new JSONObject();
				jsonObject2.put("result", "1");
				String str = jsonObject2.toString();
				System.out.print("删除成功！");
				response.getWriter().write(str);	
			}else{
				JSONObject jsonObject2 = new JSONObject();
				jsonObject2.put("result", "2");
				String str = jsonObject2.toString();
				System.out.print("删除失败！");
				response.getWriter().write(str);	
			}
		}else{
			//根据公众号 id 查询文章列表
			String selectsql = "Select * from articel where g_id = "+ id +" order by no desc";
			List list = Tools.executeQuary(selectsql);
			
			if(list.size()>0){
				JSONObject jsonObject2 = new JSONObject();
				JSONArray ll=JSONArray.fromObject(list);
				jsonObject2.put("result", "1");
				jsonObject2.put("content", ll);
				String str = jsonObject2.toString();
				System.out.print("查询成功"+str);
				response.getWriter().write(str);	
			}else if(list.size()== 0){
				JSONObject jsonObject2 = new JSONObject();
				JSONArray ll=JSONArray.fromObject(list);
				jsonObject2.put("content", ll);
				jsonObject2.put("result", "0");
				String str = jsonObject2.toString();
				System.out.print("文章列表为空"+str);
				response.getWriter().write(str);	
			}else{
				JSONObject jsonObject2 = new JSONObject();
				JSONArray ll=JSONArray.fromObject(list);
				jsonObject2.put("content", ll);
				jsonObject2.put("result", "0");
				String str = jsonObject2.toString();
				System.out.print("查询失败"+str);
				response.getWriter().write(str);
			}
		}
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}
