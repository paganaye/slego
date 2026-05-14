package com.ganaye.slego.utils;

public class IntUtils {
    public static int sensibleModulo(int n, int mod) {
        int result = n % mod;
        if (result < 0) result += mod;
        return result;
    }
}
