package com.uniovi.tests.pageobjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class PO_AddOfertaView {
	
	static public void fillForm(WebDriver driver, String titulop,String detallep,String preciop) {
		WebElement titulo = driver.findElement(By.name("titulo"));
		titulo.click();
		titulo.clear();
		titulo.sendKeys(titulop);
		WebElement detalle = driver.findElement(By.name("detalle"));
		detalle.click();
		detalle.clear();
		detalle.sendKeys(detallep);
		WebElement precio = driver.findElement(By.name("precio"));
		precio.click();
		precio.clear();
		precio.sendKeys(preciop);
		//Pulsar el boton de Alta.
		By boton = By.className("btn");
		driver.findElement(boton).click();
	}

}
