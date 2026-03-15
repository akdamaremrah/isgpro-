def calculate_igu_minutes(employee_count: int, danger_class_name: str) -> int:
    """İş Güvenliği Uzmanı (İGU) aylık hizmet süresi hesaplaması"""
    if danger_class_name == "Az Tehlikeli":
        return employee_count * 10
    elif danger_class_name == "Tehlikeli":
        return employee_count * 20
    elif danger_class_name == "Çok Tehlikeli":
        return employee_count * 40
    return 0

def calculate_iyh_minutes(employee_count: int, danger_class_name: str) -> int:
    """İşyeri Hekimi (İYH) aylık hizmet süresi hesaplaması"""
    if danger_class_name == "Az Tehlikeli":
        return employee_count * 5
    elif danger_class_name == "Tehlikeli":
        return employee_count * 10
    elif danger_class_name == "Çok Tehlikeli":
        return employee_count * 15
    return 0

def calculate_dsp_minutes(employee_count: int, danger_class_name: str) -> int:
    """Diğer Sağlık Personeli (DSP) aylık hizmet süresi hesaplaması"""
    if danger_class_name == "Çok Tehlikeli":
        if 10 <= employee_count <= 49:
            return employee_count * 10
        elif 50 <= employee_count <= 249:
            return employee_count * 15
        elif employee_count >= 250:
            return employee_count * 20
    return 0

def calculate_monthly_service_minutes(role: str, employee_count: int, danger_class_name: str) -> int:
    """
    Belirtilen rol, çalışan sayısı ve tehlike sınıfı için aylık hizmet süresini (dakika) hesaplar.
    :param role: IGU, IYH veya DSP
    :param employee_count: Firmanın toplam çalışan sayısı
    :param danger_class_name: Firmanın tehlike sınıfı adı ("Az Tehlikeli", "Tehlikeli", "Çok Tehlikeli")
    :return: Hesaplanan dakika
    """
    if employee_count <= 0:
        return 0

    if role == "IGU":
        return calculate_igu_minutes(employee_count, danger_class_name)
    elif role == "IYH":
        return calculate_iyh_minutes(employee_count, danger_class_name)
    elif role == "DSP":
        return calculate_dsp_minutes(employee_count, danger_class_name)
    
    return 0
