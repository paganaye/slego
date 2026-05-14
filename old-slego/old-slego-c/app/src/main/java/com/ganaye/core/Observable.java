package com.ganaye.core;

import android.util.Log;

import java.lang.ref.WeakReference;
import java.util.ArrayList;

public abstract class Observable<T> {
    private static final String TAG = "Observable<T>";
    private final Object sender;
    private ArrayList<OwnerAndObserver> observers;

    public Observable(Object owner, T initialValue) {
        this.sender = owner;
        setValue(initialValue);
    }

    public abstract T getValue();

    protected abstract void setValue(T newValue);

    public void addObserverAndRun(IDisposable owner, Observer observer) {
        addObserver(owner, observer);
        observer.itemChanged();
    }

    public void addObserver(IDisposable owner, Observer observer) {
        OwnerAndObserver ownerAndObserver = new OwnerAndObserver(owner, observer);
        if (this.observers == null) this.observers = new ArrayList<>();
        this.observers.add(new OwnerAndObserver(owner, observer));
    }

    public void removeObserver(Object owner) {
        for (int i = observers.size() - 1; i >= 0; i--) {
            OwnerAndObserver o = observers.get(i);
            if (o.owner == owner) {
                o.clear();
                observers.remove(i);
            }
        }
    }

    public void raiseValueChanged() {
        if (observers != null) {
            // Log.d(TAG, "raising " + observers.size() + " value changed.");
            for (int i = observers.size() - 1; i >= 0; i--) {
                Observable.OwnerAndObserver o = observers.get(i);
                IDisposable owner = (IDisposable) o.owner.get();

                if (owner == null || owner.isDisposed()) {
                    if (owner == null) Log.d(TAG, "owner is null");
                    else if (owner.isDisposed()) Log.d(TAG, "owner is disposed");

                    Log.d(TAG, "#" + i + " " + (o == null ? "null" : o.getClass().getSimpleName()) + " is Disposed");
                    o.clear();
                    observers.remove(i);
                } else {
                    //Log.d(TAG, "raising #" + i);
                    Observer observer = (Observer) o.observer;
                    if (observer == null) Log.d(TAG, "observer is null");
                    if (observer != null) observer.itemChanged();
                }
            }
        } else {
            // Log.d(TAG, "no observers");
        }
    }

    public interface Observer {
        void itemChanged();
    }

    private class OwnerAndObserver {
        public final WeakReference<IDisposable> owner;
        public final Observer observer;

        private OwnerAndObserver(IDisposable owner, Observer observer) {
            this.owner = new WeakReference<>(owner);
            this.observer = observer;
        }

        public void clear() {
            owner.clear();
        }

//        public final IDisposable owner;
//        public final Observer observer;
//
//        private OwnerAndObserver(IDisposable owner, Observer observer) {
//            this.owner = owner;
//            this.observer = observer;
//        }
    }
}
