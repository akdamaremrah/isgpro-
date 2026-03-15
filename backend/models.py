from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func
from sqlalchemy import event
import enum

db = SQLAlchemy()

def calculate_service_minutes(hazard_class: str, emp_count: int, role: str) -> int:
    """
    İGU: Az (10dk), Tehlikeli (20dk), Çok Tehlikeli (40dk)
    İYH: Az (5dk), Tehlikeli (10dk), Çok Tehlikeli (15dk)
    DSP: Çok Tehlikeli && >=10 çalışan. (10-49: 10, 50-249: 15, >=250: 20dk)
    """
    if emp_count <= 0:
        return 0
        
    if role == 'IGU':
        if hazard_class == 'Çok Tehlikeli': return emp_count * 40
        if hazard_class == 'Tehlikeli': return emp_count * 20
        return emp_count * 10
    elif role == 'IYH':
        if hazard_class == 'Çok Tehlikeli': return emp_count * 15
        if hazard_class == 'Tehlikeli': return emp_count * 10
        return emp_count * 5
    elif role == 'DSP':
        if hazard_class == 'Çok Tehlikeli' and emp_count >= 10:
            if emp_count <= 49: return emp_count * 10
            if emp_count <= 249: return emp_count * 15
            return emp_count * 20
    return 0

# ==========================================
# ENUMS
# ==========================================
class RoleEnum(enum.Enum):
    IGU = "IGU"
    IYH = "IYH"
    DSP = "DSP"

class GenderEnum(enum.Enum):
    E = "E"
    K = "K"

class AssignmentTypeEnum(enum.Enum):
    Calisan_Temsilcisi = "Çalışan Temsilcisi"
    Arama_Ekibi = "Arama Ekibi"
    Kurtarma_Ekibi = "Kurtarma Ekibi"
    Sondurme_Ekibi = "Söndürme Ekibi"
    Koruma_Ekibi = "Koruma Ekibi"
    Ilkyardim_Ekibi = "İlkyardım Ekibi"
    ISG_Kurul_Uyesi = "İSG Kurul Üyesi"
    Destek_Elemani = "Destek Elemanı"
    Risk_Degerlendirme_Ekibi = "Risk Değerlendirme Ekibi"
    Acil_Durum_Koordinaturu = "Acil Durum Koordinatörü"

class HealthStatusEnum(enum.Enum):
    Uygun = "Uygun"
    Sartli_Uygun = "Şartlı Uygun"
    Uygun_Degil = "Uygun Değil"

class DocumentTypeEnum(enum.Enum):
    Risk_Degerlendirmesi = "Risk Değerlendirmesi"
    Acil_Durum_Plani = "Acil Durum Planı"
    Yillik_Calisma_Plani = "Yıllık Çalışma Planı"
    Yillik_Egitim_Plani = "Yıllık Eğitim Planı"
    Yillik_Degerlendirme_Raporu = "Yıllık Değerlendirme Raporu"

class TrainingDocTypeEnum(enum.Enum):
    Katilim_Formu = "Eğitim Katılım Formu"
    Sorular = "Eğitim Soruları"
    Sertifika = "Eğitim Katılım Sertifikası"

class RiskStatusEnum(enum.Enum):
    Acik = "Açık"
    Kapali = "Kapalı"
    Gecikmis = "Gecikmiş"

# ==========================================
# 1. Sistem ve Referans Tabloları (Sabit Veriler)
# ==========================================
class DangerClass(db.Model):
    __tablename__ = 'danger_classes'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False) # Az Tehlikeli, Tehlikeli, Çok Tehlikeli
    color_code = db.Column(db.String(20), nullable=False)
    
    # Relationships
    nace_codes = db.relationship('NaceCode', backref='danger_class', lazy=True)

    def __repr__(self):
        return f"<DangerClass {self.name}>"

class NaceCode(db.Model):
    __tablename__ = 'nace_codes'
    
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(20), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=False)
    danger_class_id = db.Column(db.Integer, db.ForeignKey('danger_classes.id'), nullable=False)

    # Relationships
    companies = db.relationship('Company', backref='nace_code', lazy=True)

    def __repr__(self):
        return f"<NaceCode {self.code}>"

class City(db.Model):
    __tablename__ = 'cities'
    
    id = db.Column(db.Integer, primary_key=True) # Plaka kodu
    name = db.Column(db.String(100), nullable=False)

    # Relationships
    districts = db.relationship('District', backref='city', lazy=True, cascade="all, delete-orphan")
    companies = db.relationship('Company', backref='city', lazy=True)

    def __repr__(self):
        return f"<City {self.name}>"

class District(db.Model):
    __tablename__ = 'districts'
    
    id = db.Column(db.Integer, primary_key=True)
    city_id = db.Column(db.Integer, db.ForeignKey('cities.id', ondelete='CASCADE'), nullable=False)
    name = db.Column(db.String(100), nullable=False)

    # Relationships
    companies = db.relationship('Company', backref='district', lazy=True)

    def __repr__(self):
        return f"<District {self.name}>"

# ==========================================
# 2. Ana Operasyon Tabloları
# ==========================================
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    role = db.Column(db.String(50), nullable=False, default='İSG Uzmanı')
    password = db.Column(db.String(255), nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'full_name': self.full_name,
            'email': self.email,
            'role': self.role,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Company(db.Model):
    __tablename__ = 'companies'
    
    id = db.Column(db.Integer, primary_key=True)
    short_name = db.Column(db.String(100), nullable=False)
    official_title = db.Column(db.String(255), nullable=False)
    sgk_no = db.Column(db.String(26), unique=True, nullable=False)
    nace_code_id = db.Column(db.Integer, db.ForeignKey('nace_codes.id'), nullable=False)
    employee_count = db.Column(db.Integer, default=0)
    
    # İşveren / İşveren Vekili bilgileri
    employer_name = db.Column(db.String(150), nullable=False)
    employer_role = db.Column(db.String(100), nullable=True)
    employer_phone = db.Column(db.String(20), nullable=True)
    employer_email = db.Column(db.String(150), nullable=True)
    
    # Yetkili Personel bilgileri
    authorized_person = db.Column(db.String(150), nullable=False)
    authorized_role = db.Column(db.String(100), nullable=True)
    authorized_phone = db.Column(db.String(20), nullable=True)
    authorized_email = db.Column(db.String(150), nullable=True)
    
    city_id = db.Column(db.Integer, db.ForeignKey('cities.id'), nullable=False)
    district_id = db.Column(db.Integer, db.ForeignKey('districts.id'), nullable=False)
    address = db.Column(db.Text, nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    has_isg_kurulu = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=func.now())

    # Relationships (Cascade delete for related data when a company is deleted)
    professionals = db.relationship('CompanyProfessional', back_populates='company', lazy=True, cascade="all, delete-orphan")
    personnel = db.relationship('Personnel', back_populates='company', lazy=True, cascade="all, delete-orphan")
    assignments = db.relationship('Assignment', foreign_keys="Assignment.company_id", back_populates="company", lazy=True, cascade="all, delete-orphan")
    documents = db.relationship('Document', backref='company', lazy=True, cascade="all, delete-orphan")
    periodic_controls = db.relationship('PeriodicControl', backref='company', lazy=True, cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Company {self.short_name} - {self.sgk_no}>"

class CompanyProfessional(db.Model):
    __tablename__ = 'company_professionals'
    
    id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id', ondelete='CASCADE'), nullable=False)
    professional_name = db.Column(db.String(150), nullable=False)
    role = db.Column(db.Enum(RoleEnum), nullable=False)
    contract_start_date = db.Column(db.Date, nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    monthly_service_minutes = db.Column(db.Integer, nullable=True)
    profile_photo = db.Column(db.String(255), nullable=True)
    tc_kimlik_no = db.Column(db.String(11), nullable=True)
    certificate_class = db.Column(db.String(50), nullable=True)
    certificate_number = db.Column(db.String(100), nullable=True)
    phone_number = db.Column(db.String(20), nullable=True)
    email = db.Column(db.String(100), nullable=True)

    company = db.relationship('Company', back_populates='professionals')
    assignments = db.relationship('Assignment', foreign_keys="Assignment.professional_id", back_populates='professional', cascade="all, delete-orphan")

    def __repr__(self):
        return f"<CompanyProfessional {self.professional_name} ({self.role.name}) - Active: {self.is_active}>"

# ==========================================
# 3. Personel ve İSG Süreçleri Tabloları
# ==========================================
class Personnel(db.Model):
    __tablename__ = 'personnel'
    
    id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id', ondelete='CASCADE'), nullable=False)
    tc_no = db.Column(db.String(11), nullable=False)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    job_title = db.Column(db.String(150), nullable=True)
    birth_date = db.Column(db.Date, nullable=True)
    gender = db.Column(db.Enum(GenderEnum), nullable=True)
    hire_date = db.Column(db.Date, nullable=True)
    phone_number = db.Column(db.String(20), nullable=True)
    blood_type = db.Column(db.String(10), nullable=True) # A+, B-, etc.
    education_level = db.Column(db.String(100), nullable=True) # İlkokul, Lisans, vb.
    marital_status = db.Column(db.String(20), nullable=True) # Bekar, Evli
    disability_status = db.Column(db.String(20), nullable=True) # Yok, Var
    
    # Dates
    training_date_1 = db.Column(db.Date, nullable=True)
    training_date_2 = db.Column(db.Date, nullable=True)
    health_exam_date = db.Column(db.Date, nullable=True)
    
    # Calculated Validity Dates
    training_validity_date = db.Column(db.Date, nullable=True)
    health_validity_date = db.Column(db.Date, nullable=True)
    
    # Dynamic list (stored as JSON string)
    professional_competencies = db.Column(db.JSON, nullable=True, default=[])
    photo_path = db.Column(db.String(255), nullable=True)
    
    is_active = db.Column(db.Boolean, default=True)

    __table_args__ = (
        db.UniqueConstraint('company_id', 'tc_no', name='uix_company_tc'),
    )

    company = db.relationship('Company', back_populates='personnel')
    assignments = db.relationship('Assignment', foreign_keys="Assignment.personnel_id", back_populates='personnel', cascade="all, delete-orphan")
    trainings = db.relationship('Training', backref='personnel', lazy=True, cascade="all, delete-orphan")
    health_records = db.relationship('HealthRecord', backref='personnel', lazy=True, cascade="all, delete-orphan")

    @property
    def latest_training_validity(self):
        if not self.trainings:
            return None
        latest = sorted(self.trainings, key=lambda x: x.valid_until, reverse=True)
        return latest[0].valid_until if latest else None

    @property
    def latest_health_examination_validity(self):
        if not self.health_records:
            return None
        latest = sorted(self.health_records, key=lambda x: x.next_examination_date, reverse=True)
        return latest[0].next_examination_date if latest else None

    def __repr__(self):
        return f"<Personnel {self.first_name} {self.last_name} ({self.tc_no})>"

    def calculate_validity_dates(self):
        """Calculates validity dates based on hazard class of the company."""
        from datetime import date
        from dateutil.relativedelta import relativedelta
        
        # If company relationship is not loaded, find it via id
        company_obj = self.company
        if not company_obj and self.company_id:
            company_obj = Company.query.get(self.company_id)
            
        if not company_obj or not company_obj.nace_code or not company_obj.nace_code.danger_class:
            return

        danger_name = company_obj.nace_code.danger_class.name
        
        # 1. Training Validity
        # Find latest training date
        t_dates = [d for d in [self.training_date_1, self.training_date_2] if d]
        if t_dates:
            latest_t = max(t_dates)
            years = 3 # Default Az Tehlikeli
            if danger_name == 'Çok Tehlikeli': years = 1
            elif danger_name == 'Tehlikeli': years = 2
            self.training_validity_date = latest_t + relativedelta(years=years)
        
        # 2. Health Exam Validity
        if self.health_exam_date:
            years = 5 # Default Az Tehlikeli
            if danger_name == 'Çok Tehlikeli': years = 1
            elif danger_name == 'Tehlikeli': years = 3
            self.health_validity_date = self.health_exam_date + relativedelta(years=years)

# Helper for reactive recalculation
def sync_professionals_internal(connection, company_id, employee_count):
    """Internal helper to sync all professionals of a company via SQL connection."""
    company_table = Company.__table__
    nace_table = NaceCode.__table__
    danger_table = DangerClass.__table__
    profs_table = CompanyProfessional.__table__

    # 1. Get Hazard Class Name
    # We join Company -> Nace -> Danger to get the current danger class name
    stmt = (
        db.select(danger_table.c.name)
        .select_from(company_table.join(nace_table).join(danger_table))
        .where(company_table.c.id == company_id)
    )
    hazard_name = connection.execute(stmt).scalar() or "Tehlikeli"

    # 2. Update all professionals via connection
    # Fetch current roles for this company
    select_stmt = profs_table.select().where(profs_table.c.company_id == company_id)
    profs = connection.execute(select_stmt).fetchall()

    for p in profs:
        # P is a Row proxy, accessible by index or name
        new_minutes = calculate_service_minutes(hazard_name, employee_count, p.role.name)
        if new_minutes != p.monthly_service_minutes:
            connection.execute(
                profs_table.update().where(profs_table.c.id == p.id).values(monthly_service_minutes=new_minutes)
            )

# SQLAlchemy Listeners for automatic employee count sync
def update_company_employee_count(mapper, connection, target):
    company_table = Company.__table__
    personnel_table = Personnel.__table__
    
    # Calculate new count
    select_stmt = func.count(personnel_table.c.id).select().where(personnel_table.c.company_id == target.company_id)
    count = connection.execute(select_stmt).scalar()
    
    # Update Company table
    connection.execute(
        company_table.update().where(company_table.c.id == target.company_id).values(employee_count=count)
    )
    
    # REACTIVE: Also recalculate all professionals' minutes based on new count
    sync_professionals_internal(connection, target.company_id, count)

@event.listens_for(Personnel, 'after_insert')
def personnel_after_insert(mapper, connection, target):
    update_company_employee_count(mapper, connection, target)

@event.listens_for(Personnel, 'after_delete')
def personnel_after_delete(mapper, connection, target):
    update_company_employee_count(mapper, connection, target)

@event.listens_for(Personnel, 'after_update')
def personnel_after_update(mapper, connection, target):
    # Only update if company_id changed (rare but possible)
    state = db.inspect(target)
    history = state.get_history('company_id', True)
    if history.has_changes():
        update_company_employee_count(mapper, connection, target)
        # Also update the old company if it exists
        if history.deleted:
            old_company_id = history.deleted[0]
            company_table = Company.__table__
            personnel_table = Personnel.__table__
            select_stmt = func.count(personnel_table.c.id).select().where(personnel_table.c.company_id == old_company_id)
            count = connection.execute(select_stmt).scalar()
            connection.execute(
                company_table.update().where(company_table.c.id == old_company_id).values(employee_count=count)
            )
            # REACTIVE: Sync old company professionals too
            sync_professionals_internal(connection, old_company_id, count)

@event.listens_for(Company, 'after_update')
def company_after_update(mapper, connection, target):
    """
    Whenever employee_count or hazard_class changes manually (e.g. via Edit Form), 
    recalculate all professionals' service minutes.
    """
    state = db.inspect(target)
    count_history = state.get_history('employee_count', True)
    nace_history = state.get_history('nace_code_id', True)
    employer_history = state.get_history('employer_name', True)
    
    if count_history.has_changes() or nace_history.has_changes():
        sync_professionals_internal(connection, target.id, target.employee_count)
    
    if count_history.has_changes() or nace_history.has_changes() or employer_history.has_changes():
        # Using a direct SQL trigger for risk team is complex due to skeletal personnel.
        # It's better to keep it in the app.py routes for now or use a deferred task.
        # For now, let's at least ensure we note it.
        pass

class Assignment(db.Model):
    __tablename__ = 'assignments'
    
    id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id', ondelete='CASCADE'), nullable=False)
    personnel_id = db.Column(db.Integer, db.ForeignKey('personnel.id', ondelete='CASCADE'), nullable=True)
    professional_id = db.Column(db.Integer, db.ForeignKey('company_professionals.id', ondelete='CASCADE'), nullable=True)
    employer_id = db.Column(db.Integer, db.ForeignKey('companies.id', ondelete='CASCADE'), nullable=True)
    
    assignment_type = db.Column(db.Enum(AssignmentTypeEnum), nullable=False)
    assignment_date = db.Column(db.Date, nullable=False, default=func.current_date())
    training_date = db.Column(db.Date, nullable=True)
    training_validity_date = db.Column(db.Date, nullable=True)
    role_in_team = db.Column(db.String(100), nullable=True)
    document_path = db.Column(db.String(255), nullable=True)

    # Specific relationships for multi-source
    company = db.relationship('Company', foreign_keys=[company_id], back_populates="assignments")
    personnel = db.relationship('Personnel', foreign_keys=[personnel_id], back_populates="assignments")
    professional = db.relationship('CompanyProfessional', foreign_keys=[professional_id], back_populates="assignments")

    @property
    def person_name(self):
        if self.personnel_id and self.personnel:
            return f"{self.personnel.first_name} {self.personnel.last_name}"
        if self.professional_id and self.professional:
            return self.professional.professional_name
        if self.employer_id and self.company:
            return self.company.employer_name
        return "Bilinmeyen"

    @property
    def person_role(self):
        if self.professional_id and self.professional:
            return self.professional.role.value
        if self.employer_id:
            return "İşveren / İşveren Vekili"
        if self.personnel_id and self.personnel:
            return self.personnel.job_title
        return self.role_in_team or "Atandı"

    def __repr__(self):
        return f"<Assignment {self.assignment_type.name} - {self.person_name}>"

class Training(db.Model):
    __tablename__ = 'trainings'
    
    id = db.Column(db.Integer, primary_key=True)
    personnel_id = db.Column(db.Integer, db.ForeignKey('personnel.id', ondelete='CASCADE'), nullable=False)
    training_name = db.Column(db.String(255), nullable=False)
    completion_date = db.Column(db.Date, nullable=False)
    valid_until = db.Column(db.Date, nullable=False)

    def __repr__(self):
        return f"<Training {self.training_name} - Personnel ID: {self.personnel_id}>"

class HealthRecord(db.Model):
    __tablename__ = 'health_records'
    
    id = db.Column(db.Integer, primary_key=True)
    personnel_id = db.Column(db.Integer, db.ForeignKey('personnel.id', ondelete='CASCADE'), nullable=False)
    examination_date = db.Column(db.Date, nullable=False)
    next_examination_date = db.Column(db.Date, nullable=False)
    status = db.Column(db.Enum(HealthStatusEnum), nullable=False)

    def __repr__(self):
        return f"<HealthRecord {self.examination_date} - Status: {self.status.name}>"

# ==========================================
# 4. Kurumsal Belgeler ve Kontroller
# ==========================================
class Document(db.Model):
    __tablename__ = 'documents'
    
    id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id', ondelete='CASCADE'), nullable=False)
    document_type = db.Column(db.Enum(DocumentTypeEnum), nullable=False)
    issue_date = db.Column(db.Date, nullable=False)
    revision_date = db.Column(db.Date, nullable=False)
    file_path = db.Column(db.String(255), nullable=False)

    def __repr__(self):
        return f"<Document {self.document_type.name} - Company ID: {self.company_id}>"

class PeriodicControl(db.Model):
    __tablename__ = 'periodic_controls'
    
    id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id', ondelete='CASCADE'), nullable=False)
    equipment_name = db.Column(db.String(255), nullable=False)
    last_control_date = db.Column(db.Date, nullable=False)
    next_control_date = db.Column(db.Date, nullable=False)
    report_path = db.Column(db.String(255), nullable=True)

    def __repr__(self):
        return f"<PeriodicControl {self.equipment_name} - Company ID: {self.company_id}>"


class TrainingDocument(db.Model):
    __tablename__ = 'training_documents'

    id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id', ondelete='CASCADE'), nullable=False)
    doc_type = db.Column(db.Enum(TrainingDocTypeEnum), nullable=False)
    original_filename = db.Column(db.String(255), nullable=False)
    stored_filename = db.Column(db.String(255), nullable=False)
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)

    company = db.relationship('Company', backref='training_documents')

    def __repr__(self):
        return f"<TrainingDocument {self.doc_type.value} - {self.original_filename}>"


class HealthDocTypeEnum(enum.Enum):
    Muayene_Formu = "Muayene Formları"
    Tetkik = "Tetkikler"


class HealthDocument(db.Model):
    __tablename__ = 'health_documents'

    id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id', ondelete='CASCADE'), nullable=False)
    doc_type = db.Column(db.Enum(HealthDocTypeEnum), nullable=False)
    original_filename = db.Column(db.String(255), nullable=False)
    stored_filename = db.Column(db.String(255), nullable=False)
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)

    company = db.relationship('Company', backref='health_documents')

    def __repr__(self):
        return f"<HealthDocument {self.doc_type.value} - {self.original_filename}>"


# ==========================================
# Risk Değerlendirmesi (Fine Kinney)
# Excel Şablon Sütun Sırası:
# Sıra No | Yapılan İş/Faaliyet | Tehlike | Risk/Olası Etki |
# Açıklama/Düzeltici Tedbirler | Mevcutta Alınan Önlemler |
# İlk Risk (O, Ş, F, Puan, Düzey) | Son Risk (O, Ş, F, Puan, Düzey) |
# Sorumlu | Termin Süresi
# ==========================================
class RiskAssessment(db.Model):
    __tablename__ = 'risk_assessments'
    
    id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id', ondelete='CASCADE'), nullable=False)
    
    # Temel bilgiler
    activity = db.Column(db.String(500), nullable=False)           # Yapılan İş / Faaliyet / Ekipman / Ortam
    hazard = db.Column(db.String(500), nullable=False)             # Tehlike
    risk_effect = db.Column(db.String(500), nullable=False)        # Risk / Olası Etki
    corrective_measures = db.Column(db.Text, nullable=True)        # Açıklama / Düzeltici ve Önleyici Tedbirler
    existing_measures = db.Column(db.Text, nullable=True)          # Mevcutta Alınan Önlemler
    
    # İlk Risk (Initial Risk)
    initial_probability = db.Column(db.Float, nullable=True, default=0)   # Olasılık (O)
    initial_severity = db.Column(db.Float, nullable=True, default=0)      # Şiddet (Ş)
    initial_frequency = db.Column(db.Float, nullable=True, default=0)     # Frekans (F)
    initial_risk_score = db.Column(db.Float, nullable=True, default=0)    # Risk Puanı (otomatik)
    initial_risk_level = db.Column(db.String(100), nullable=True, default='Önemsiz Risk')  # Risk Düzeyi (otomatik)
    
    # Son Risk (Residual Risk)
    final_probability = db.Column(db.Float, nullable=True, default=0)     # Olasılık (O)
    final_severity = db.Column(db.Float, nullable=True, default=0)        # Şiddet (Ş)
    final_frequency = db.Column(db.Float, nullable=True, default=0)       # Frekans (F)
    final_risk_score = db.Column(db.Float, nullable=True, default=0)      # Risk Puanı (otomatik)
    final_risk_level = db.Column(db.String(100), nullable=True, default='Önemsiz Risk')    # Risk Düzeyi (otomatik)
    
    # Sorumluluk
    responsible_person = db.Column(db.String(200), nullable=True)  # Sorumlu
    deadline = db.Column(db.String(100), nullable=True)            # Termin Süresi
    
    created_at = db.Column(db.DateTime, server_default=func.now())

    @staticmethod
    def _calculate_level(score):
        """Fine Kinney risk düzeyi hesaplama"""
        if score <= 20:
            return "Önemsiz Risk"
        elif score <= 70:
            return "Olası Risk"
        elif score <= 200:
            return "Önemli Risk"
        elif score <= 400:
            return "Esaslı Risk"
        else:
            return "Tolerans Gösterilemez Risk"

    def calculate_risks(self):
        """Fine Kinney: R = O × Ş × F (both initial and final)"""
        # İlk Risk
        o = self.initial_probability or 0
        s = self.initial_severity or 0
        f = self.initial_frequency or 0
        self.initial_risk_score = o * s * f
        self.initial_risk_level = self._calculate_level(self.initial_risk_score)
        
        # Son Risk
        o2 = self.final_probability or 0
        s2 = self.final_severity or 0
        f2 = self.final_frequency or 0
        self.final_risk_score = o2 * s2 * f2
        self.final_risk_level = self._calculate_level(self.final_risk_score)

    def __repr__(self):
        return f"<RiskAssessment {self.id} - Initial R={self.initial_risk_score}, Final R={self.final_risk_score}>"
