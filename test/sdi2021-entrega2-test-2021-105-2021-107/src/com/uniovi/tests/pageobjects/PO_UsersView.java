package com.uniovi.tests.pageobjects;


import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class PO_UsersView {
	
	static public void deleteUser(WebDriver driver, String email) {
		
		WebElement ck = driver.findElement(By.id(email));
		ck.click();
		

		WebElement button = driver.findElement(By.name("bEliminar"));
		button.click();
	}

	public static void deleteUsers(WebDriver driver, String[] emails) {
		
		WebElement ck;
		
		for(String email:emails) {
			ck = driver.findElement(By.id(email));
			ck.click();
		}
		
		WebElement button = driver.findElement(By.name("bEliminar"));
		button.click();
		
	}

}
