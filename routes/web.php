<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\StokValasController;
use App\Http\Controllers\LaporanController;
use App\Http\Controllers\RiwayatController;
use App\Http\Controllers\UserManagementController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\InvoiceTemplateController;
use App\Http\Controllers\NotaLayoutController;
use App\Http\Controllers\ReceiptTemplateController;

Route::get('/', function () {
    return Inertia::render('Auth/Login');
})->middleware('role:admin,staff');

Route::middleware(['auth', 'verified', 'role:admin,staff'])->group(function () {

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    // Laporan
    Route::get('/laporan', [LaporanController::class, 'index'])
        ->name('laporan.index');
    Route::get('/laporan/export', [LaporanController::class, 'export'])
        ->name('laporan.export');
    Route::post('/laporan/end-shift', [LaporanController::class, 'endShift'])
        ->name('laporan.end-shift');
    Route::post('/laporan', [LaporanController::class, 'store'])
        ->name('laporan.store');
    Route::delete('/laporan/{id}', [LaporanController::class, 'destroy'])
        ->name('laporan.destroy');

    // Riwayat & Nota
    Route::get('/riwayat', [RiwayatController::class, 'index'])
        ->name('riwayat.index');
    Route::get('/riwayat/{transaction}/print', [RiwayatController::class, 'print'])
        ->name('riwayat.print');

    // Invoice & Nota
    Route::put('/settings/invoice-template', [InvoiceTemplateController::class, 'update'])
        ->name('invoice-template.update');
    Route::get('/invoice/{transaction}', [InvoiceTemplateController::class, 'show']);

    Route::post('/nota-layout/save', [NotaLayoutController::class, 'save'])
        ->name('nota-layout.save');

    Route::post('/receipt-templates', [ReceiptTemplateController::class, 'store']);
    Route::get('/receipt-templates/active', [ReceiptTemplateController::class, 'active']);
});

Route::middleware(['auth', 'verified', 'role:staff'])->group(function () {

    // Transaksi
    Route::get('/transaksi', [TransactionController::class, 'index'])
        ->name('transaksi');
    Route::post('/transaksi', [TransactionController::class, 'store']);
    Route::post('/currencies/quick', [TransactionController::class, 'quickStoreCurrency']);

    // Stok Valas
    Route::get('/stok-valas', [StokValasController::class, 'index'])
        ->name('stok-valas');
    Route::post('/stok-valas', [StokValasController::class, 'store'])
        ->name('stok-valas.store');
    Route::delete('/stok-valas/{id}', [StokValasController::class, 'destroy'])
        ->name('stok-valas.destroy');
});

Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {

    // Settings & User Management
    Route::get('/settings', [UserManagementController::class, 'index'])
        ->name('settings');
    Route::post('/users', [UserManagementController::class, 'store'])
        ->name('users.store');
    Route::put('/users/{user}/password', [UserManagementController::class, 'updatePassword'])
        ->name('users.update-password');
    Route::delete('/users/{user}', [UserManagementController::class, 'destroy'])
        ->name('users.destroy');

    Route::put('/financial-accounts', [UserManagementController::class, 'updateFinancial'])
        ->name('financial.update');
    Route::put('/currencies/stock', [UserManagementController::class, 'updateStock'])
        ->name('currencies.update-stock');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])
        ->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])
        ->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])
        ->name('profile.destroy');
});

require __DIR__ . '/auth.php';
