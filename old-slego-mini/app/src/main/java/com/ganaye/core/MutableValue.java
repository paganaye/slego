package com.ganaye.core;


public class MutableValue<T> {
    private T actualValue;
    private final Observable<T> observable;

    public MutableValue(Object owner, T initialValue) {
        observable = new Observable<T>(owner, initialValue) {
            @Override
            public T getValue() {
                return actualValue;
            }

            @Override
            protected void setValue(T newValue) {
                actualValue = newValue;
            }
        };
    }

    public void setValue(T newValue) {
        this.actualValue = newValue;
        observable.raiseValueChanged();
    }

    public Observable<T> getObservable() {
        return observable;
    }

    public T getValue() {
        return observable.getValue();
    }
}