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

Route::get('/transaksi', [\App\Http\Controllers\TransactionController::class, 'index'])->middleware(['auth', 'verified'])->name('transaksi');
Route::post('/transaksi', [\App\Http\Controllers\TransactionController::class, 'store'])->middleware(['auth', 'verified']);
Route::post('/currencies/quick', [\App\Http\Controllers\TransactionController::class, 'quickStoreCurrency']);

Route::get('/stok-valas', [\App\Http\Controllers\StokValasController::class, 'index'])->middleware(['auth', 'verified'])->name('stok-valas');
Route::post('/stok-valas', [\App\Http\Controllers\StokValasController::class, 'store'])->middleware(['auth', 'verified'])->name('stok-valas.store');

Route::get('/operational', function () {
    return Inertia::render('Operational/Index');
})->middleware(['auth', 'verified'])->name('operational');

Route::get('/laporan', [\App\Http\Controllers\LaporanController::class, 'index'])->middleware(['auth', 'verified'])->name('laporan.index');
Route::post('/laporan/end-shift', [\App\Http\Controllers\LaporanController::class, 'endShift'])->middleware(['auth', 'verified'])->name('laporan.end-shift');
Route::post('/laporan', [\App\Http\Controllers\LaporanController::class, 'store'])->middleware(['auth', 'verified'])->name('laporan.store');

Route::get('/riwayat', [\App\Http\Controllers\RiwayatController::class, 'index'])->middleware(['auth', 'verified'])->name('riwayat.index');
Route::get('/riwayat/{transaction}/print', [\App\Http\Controllers\RiwayatController::class, 'print'])->middleware(['auth', 'verified'])->name('riwayat.print');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/settings', [UserManagementController::class, 'index'])->name('settings');
    Route::post('/users', [UserManagementController::class, 'store'])->name('users.store');
    Route::put('/users/{user}/password', [UserManagementController::class, 'updatePassword'])->name('users.update-password');
    Route::delete('/users/{user}', [UserManagementController::class, 'destroy'])->name('users.destroy');
    Route::put('/financial-accounts', [UserManagementController::class, 'updateFinancial'])->name('financial.update');
    Route::put('/currencies/stock', [UserManagementController::class, 'updateStock'])->name('currencies.update-stock');
});


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
