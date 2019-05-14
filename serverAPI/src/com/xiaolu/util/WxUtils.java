package com.xiaolu.util;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;

public class WxUtils {
	/**
	 * 验证消息合法性
	 * @param signature
	 * @param paraStr
	 * @return
	 * @throws NoSuchAlgorithmException
	 */
	public static boolean checkSingature(String signature,String...paraStr) throws NoSuchAlgorithmException {
		
		// 按字典顺序排序
		Arrays.sort(paraStr);
		// 字符串拼接
		StringBuilder content = new StringBuilder();
		for (String string : paraStr) {
			content.append(string);
		}
		// sha1加密
		MessageDigest md = MessageDigest.getInstance("SHA-1");
		byte[] digest = md.digest(content.toString().getBytes());
		String testingStr = byteArrayToHexString(digest);
		// 比较返回
		if (testingStr.equalsIgnoreCase(signature.toUpperCase())) {
			return true;
		}
		return false;
	}
 
	// 将字节数组转换为十六进制字符串
	private static String byteArrayToHexString(byte[] bytearray) {
		String strDigest = "";
		for (int i = 0; i < bytearray.length; i++) {
			strDigest += byteToHexString(bytearray[i]);
		}
		return strDigest;
	}
 
	// 将字节转换为十六进制字符串
	private static String byteToHexString(byte ib) {
		char[] Digit = { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A',
				'B', 'C', 'D', 'E', 'F' };
		char[] ob = new char[2];
		ob[0] = Digit[(ib >>> 4) & 0X0F];
		ob[1] = Digit[ib & 0X0F];
		String s = new String(ob);
		return s;
	}

}
