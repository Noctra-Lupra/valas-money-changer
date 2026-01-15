<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\UserManagementController;

Route::get('/', function () {
    return Inertia::render('Auth/Login');
});

Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/transaksi', function () {
    return Inertia::render('Transaksi/Index');
})->middleware(['auth', 'verified'])->name('transaksi');

Route::get('/stok-valas', function () {
    return Inertia::render('StokValas/Index');
})->middleware(['auth', 'verified'])->name('stok-valas');

Route::get('/operational', function () {
    return Inertia::render('Operational/Index');
})->middleware(['auth', 'verified'])->name('operational');

Route::get('/laporan', [\App\Http\Controllers\LaporanController::class, 'index'])->middleware(['auth', 'verified'])->name('laporan');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/settings', [UserManagementController::class, 'index'])->name('settings');
    Route::post('/users', [UserManagementController::class, 'store'])->name('users.store');
    Route::put('/users/{user}/password', [UserManagementController::class, 'updatePassword'])->name('users.update-password');
    Route::delete('/users/{user}', [UserManagementController::class, 'destroy'])->name('users.destroy');
    Route::put('/financial-accounts', [UserManagementController::class, 'updateFinancial'])->name('financial.update');
});


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
