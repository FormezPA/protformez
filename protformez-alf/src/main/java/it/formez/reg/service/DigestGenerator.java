package it.formez.reg.service;

import java.io.IOException;
import java.io.InputStream;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import org.apache.log4j.Logger;


public class DigestGenerator {
	
	private DigestGenerator(){}
	
	private static Logger logger = Logger.getLogger(DigestGenerator.class);
	
	/**
	 * Sha2 generate digest. Generate a digest form inputStream using algorithm sha-2 (sha-256)
	 *
	 * @param inputStream the input stream
	 * @return the string
	 */
	public static String sha2GenerateDigest(InputStream inputStream) {
		MessageDigest md = null;
		try {
			md = MessageDigest.getInstance("SHA-256");
		} catch (NoSuchAlgorithmException e) {
			logger.error("Unable to found algorithm SHA-256", e);
		}
		
		byte[] dataBytes = new byte[1024];
		
		int nread = 0;
		try {
			while ((nread = inputStream.read(dataBytes)) != -1) {
				md.update(dataBytes, 0, nread);
			}
		} catch (IOException e) {
			logger.error("Unable to read file stream", e);
		};
		byte[] mdbytes = md.digest();
		
		// convert the byte to hex format method 1
		StringBuffer sb = new StringBuffer();
		for (int i = 0; i < mdbytes.length; i++) {
			sb.append(Integer.toString((mdbytes[i] & 0xff) + 0x100, 16).substring(1));
		}
		
		logger.debug("Hex format : " + sb.toString());
		
		return sb.toString();
	}

}
